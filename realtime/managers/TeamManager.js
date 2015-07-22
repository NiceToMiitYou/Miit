'use strict';

module.exports = function TeamManager() {
    // Load the configuration of applications
    var ApplicationsConfig = miitoo.get('ApplicationsConfig');

    // Get the store of the team
    var TeamStore = miitoo.get('TeamStore');

    // Get others Managers to handle teams and users
    var TeamManager = miitoo.get('TeamManager');
    var UserManager = miitoo.get('UserManager');
    
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    var primus = miitoo.get('Primus');

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

    function notDone(spark, event, err) {
        if(err)
        {
            miitoo.logger.error(err);
        }

        spark.write({
            event: event,
            done:  false
        });
    }

    // Handle update informations of team
    Dispatcher.register('team:update', 'ADMIN', function onUpdateTeam(spark, data, team) {
        var name   = data.name;
        var publix = data.public;

        TeamManager.updateTeam(team, name, publix, function(err, teamToUpdate){
            if(err || !team)
            {
                notDone(spark, 'team:update', err);
            }

            primus.in(team._id).write({
                event:  'team:update',
                done:   true,
                name:   name,
                public: publix
            });

            spark.request.team = teamToUpdate;
        });
    });

    // Handle update informations of team
    Dispatcher.register('team:application:add', 'ADMIN', function onAddApplicationTeam(spark, data, team) {
        var identifier = data.identifier;

        if(!identifier || !ApplicationsConfig[identifier]) {
            return;
        }

        TeamStore.addApplication(team, identifier, function(err) {

        });
    });

    // Handle update informations of team
    Dispatcher.register('team:application:update', 'ADMIN', function onUpdateApplicationTeam(spark, data, team) {
        var identifier = data.identifier;
        var publix     = data.public;

        if(!identifier || !ApplicationsConfig[identifier]) {
            return;
        }

        TeamStore.addApplication(team, identifier, publix, function(err) {
            
        });
    });

    // Handle update informations of team
    Dispatcher.register('team:application:remove', 'ADMIN', function onRemoveApplicationTeam(spark, data, team) {
        var identifier = data.identifier;

        if(!identifier || !ApplicationsConfig[identifier]) {
            return;
        }

        TeamStore.removeApplication(team, identifier, function(err) {
            
        });
    });

    // Handle invitation in team
    Dispatcher.register('team:invite', 'ADMIN', function onInvite(spark, data, team) {
        var email = data.email;

        UserManager.findUserByEmailOrCreate(email, function(err, user) {
            if(err) 
            {
                notDone(spark, 'team:invite', err);
                return;
            }

            var roles = ['USER'];

            TeamStore.addUser(team, user, roles, function(errAdd) {
                if(errAdd) 
                {
                    notDone(spark, 'team:invite', err);
                    return;
                }

                spark.write({
                    event: 'team:invite',
                    done:  true,
                    user:  {
                        id:     user.id,
                        name:   user.name,
                        email:  user.email,
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
            if(err || !user) 
            {
                notDone(spark, 'team:remove', err);
                return;
            }

            if(user.roles.indexOf('OWNER') != -1) {
                notDone(spark, 'team:remove', new Error('Cannot delete the Owner of the team.'));
                return;
            }

            TeamStore.removeUser(team, userId, function(errRemove, user) {
                if(errRemove) 
                {
                    notDone(spark, 'team:remove', errRemove);
                    return;
                }

                spark.write({
                    event: 'team:remove',
                    done:  true,
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
            if(err || !user) 
            {
                notDone(spark, 'team:promote', err);
                return;
            }

            if(user.roles.indexOf('OWNER') != -1) {
                notDone(spark, 'team:promote', new Error('Cannot promote the Owner of the team.'));
                return;
            }

            TeamStore.addRoleUser(team, userId, roles, function(errAdd) {
                if(errAdd) 
                {
                    notDone(spark, 'team:promote', errAdd);
                    return;
                }

                spark.write({
                    event: 'team:promote',
                    done:  true,
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
            if(err || !user) 
            {
                notDone(spark, 'team:demote', err);
                return;
            }

            if(user.roles.indexOf('OWNER') != -1) {
                notDone(spark, 'team:demote', new Error('Cannot demote the Owner of the team.'));
                return;
            }

            // Remove the user
            TeamStore.removeRoleUser(team, userId, roles, function(errDemote) {
                if(errDemote) 
                {
                    notDone(spark, 'team:demote', errDemote);
                    return;
                }

                spark.write({
                    event: 'team:demote',
                    done:  true,
                    id:    userId,
                    roles: roles
                });
            });
        });
    });
};
