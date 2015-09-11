'use strict';

module.exports = function TeamManager() {
    // Load the configuration of applications
    var ApplicationsConfig = miitoo.get('ApplicationsConfig');

    // Get the stores for the team
    var TeamStore         = miitoo.get('TeamStore');
    var SubscriptionStore = miitoo.get('SubscriptionStore');

    // Get the managers for the team
    var TeamManager = miitoo.get('TeamManager');
    var UserManager = miitoo.get('UserManager');
    
    // Get the dispatcher
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    // And primus
    var primus = miitoo.get('Primus');

    Dispatcher.writes([
        'team:application:add',
        'team:application:remove',
        'team:invite',
        'team:remove'
    ]);

    // Handle get informations of an user
    Dispatcher.register('team:user', 'USER', function onGetUser(spark, data, team) {
        // Find the user
        TeamStore.findUser(team, data.id, function(err, user) {
            spark.write({
                event: 'team:user',
                user: user
            });
        });
    });

    // Handle get informations of users
    Dispatcher.register('team:users', 'USER', function onGetUsers(spark, data, team) {
        // Find team users
        TeamStore.findUsers(team, function(err, users) {
            spark.write({
                event: 'team:users',
                users: users
            });
        });
    });

    // Handle update informations of team
    Dispatcher.register('team:update', 'ADMIN', function onUpdateTeam(spark, data, team) {
        var name   = data.name;
        var publix = data.public;

        if(!name || !(publix === true || publix === false)) {
            return;
        }

        TeamStore.update(team, name, publix, function(err) {

            primus.in(team.id).write({
                event:  'team:update',
                name:   name,
                public: publix
            });
        });
    });

    // Handle update informations of team
    Dispatcher.register('team:application:add', 'ADMIN', function onAddApplicationTeam(spark, data, team) {
        var identifier = data.identifier;
        var publix     = data.public;

        if(!identifier || !ApplicationsConfig[identifier] || !(publix === true || publix === false)) {
            return;
        }

        TeamStore.addApplication(team, identifier, publix, function(err) {

            primus.in(team.id).write({
                event:      'team:application:add',
                identifier: identifier,
                public:     publix
            });
        });
    });

    // Handle update informations of team
    Dispatcher.register('team:application:update', 'ADMIN', function onUpdateApplicationTeam(spark, data, team) {
        var identifier = data.identifier;
        var publix     = data.public;

        if(!identifier || !ApplicationsConfig[identifier] || !(publix === true || publix === false)) {
            return;
        }

        TeamStore.updateApplication(team, identifier, publix, function(err) {
            
            primus.in(team.id).write({
                event:      'team:application:update',
                identifier: identifier,
                public:     publix
            });
        });
    });

    // Handle update informations of team
    Dispatcher.register('team:application:remove', 'ADMIN', function onRemoveApplicationTeam(spark, data, team) {
        var identifier = data.identifier;

        if(!identifier || !ApplicationsConfig[identifier]) {
            return;
        }

        TeamStore.removeApplication(team, identifier, function(err) {
            
            SubscriptionStore.resetAllByApplication(identifier, team, function() {
                
                primus.in(team.id).write({
                    event:      'team:application:remove',
                    identifier: identifier
                }); 
            });
        });
    });

    // Handle invitation in team
    Dispatcher.register('team:invite', 'ADMIN', function onInvite(spark, data, team) {
        var email = data.email;

        UserManager.findUserByEmailOrCreate(email, function(err, user) {
            if(err) 
            {
                return;
            }

            var roles = ['USER'];

            TeamManager.invite(team, user, roles, function(errAdd) {
                if(errAdd) 
                {
                    return;
                }

                primus.in(team.id + ':ADMIN').write({
                    event: 'team:invite',
                    user: {
                        id:     user.id,
                        name:   user.name,
                        email:  user.email,
                        avatar: user.avatar,
                        roles:  roles
                    }
                });

                var rooms = [team.id + ':USER', team.id + ':ANONYM'];

                primus.in(rooms).write({
                    event: 'team:invite',
                    user: {
                        id:     user.id,
                        name:   user.name,
                        avatar: user.avatar,
                        roles:  roles
                    }
                });
            });
        });
    });

    // Handle remove user from team
    Dispatcher.register('team:remove', 'ADMIN', function onRemove(spark, data, team) {
        var userId = data.id;

        if(!userId) {
            return;
        }

        // Check if the user is not the owner
        TeamStore.findUser(team, userId, function(err, user) {
            if(err || !user || -1 !== user.roles.indexOf('OWNER')) 
            {
                return;
            }

            TeamStore.removeUser(team, userId, function(errRemove, user) {
                if(errRemove) 
                {
                    return;
                }

                primus.in(team.id).write({
                    event: 'team:remove',
                    id:    userId
                });
            });
        });
    });

    // Handle promotion in team
    Dispatcher.register('team:promote', 'ADMIN', function onPromote(spark, data, team) {
        var userId = data.id;
        var roles  = data.roles;

        if(!userId || !roles) {
            return;
        }

        // Check if the user is not the owner
        TeamStore.findUser(team, userId, function(err, user) {
            if(err || !user || -1 !== user.roles.indexOf('OWNER'))
            {
                return;
            }

            TeamStore.promoteUser(team, userId, roles, function(errAdd) {
                if(errAdd) 
                {
                    return;
                }

                primus.in(team.id).write({
                    event: 'team:promote',
                    id:    userId,
                    roles: roles
                });
            });
        });
    });

    // Handle demotion in team
    Dispatcher.register('team:demote', 'ADMIN', function onDemote(spark, data, team) {
        var userId = data.id;
        var roles  = data.roles;

        if(!userId || !roles) {
            return;
        }

        // Check if the user is not the owner
        TeamStore.findUser(team, userId, function(err, user) {
            if(err || !user || -1 !== user.roles.indexOf('OWNER'))
            {
                return;
            }

            // Remove the user
            TeamStore.demoteUser(team, userId, roles, function(errDemote) {
                if(errDemote) 
                {
                    return;
                }

                primus.in(team.id).write({
                    event: 'team:demote',
                    id:    userId,
                    roles: roles
                });
            });
        });
    });
};
