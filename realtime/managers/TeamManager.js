'use strict';

module.exports = function TeamManager() {
    var TeamStore = miitoo.get('TeamStore');

    var TeamManager = miitoo.get('TeamManager');
    var UserManager = miitoo.get('UserManager');
    
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    // Handle get informations of an user
    Dispatcher.register('team:user', 'USER', function onGetUser(spark, data, team) {
        // Find the user
        TeamStore.findUser(team, data.id, function(err, user){
            spark.write({
                event: 'team:user',
                user: user
            });
        });
    });

    // Handle get informations of users
    Dispatcher.register('team:users', 'USER', function onGetUsers(spark, data, team) {
        // Find team users
        TeamStore.findUsers(team, function(err, users){
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

        TeamManager.updateTeam(team, name, publix, function(err, teamToUpdate){
            if(err || !team)
            {
                if(err)
                {
                    miitoo.logger.error(err);
                }

                spark.write({
                    event: 'team:update',
                    done:  false
                });
            }

            spark.write({
                event:    'team:update',
                done:     true,
                name:     name,
                'public': publix
            });

            spark.request.team = teamToUpdate;
        });
    });

    function inviteNotDone(spark, err) { 
        if(err)
        {
            miitoo.logger.error(err);
        }

        spark.write({
            event: 'team:invite',
            done:  false
        });
    }

    // Handle invitation in team
    Dispatcher.register('team:invite', 'ADMIN', function onInvite(spark, data, team) {
        var email = data.email;

        UserManager.findUserByEmailOrCreate(email, function(err, user) {
            if(err) 
            {
                inviteNotDone(spark, err);
                return;
            }

            var roles = ['USER'];

            TeamStore.addUser(team, user, roles, function(errAdd) {
                if(errAdd) 
                {
                    inviteNotDone(spark, err);
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

        TeamStore.removeUser(team, userId, function(err, user) {
            if(err) 
            {
                spark.write({
                    event: 'team:remove',
                    done:  false
                });
                return;
            }

            spark.write({
                event: 'team:remove',
                done:  true,
                id:    userId
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

        TeamStore.addRoleUser(team, userId, roles, function(err) {
            if(err) 
            {
                spark.write({
                    event: 'team:promote',
                    done:  false
                });
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

    // Handle demotion in team
    Dispatcher.register('team:demote', 'ADMIN', function onDemote(spark, data, team) {
        var userId = data.id;
        var roles  = data.roles;

        TeamStore.removeRoleUser(team, userId, roles, function(err) {
            if(err) 
            {
                spark.write({
                    event: 'team:demote',
                    done:  false
                });
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
};
