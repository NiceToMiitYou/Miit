'use strict';

module.exports = function TeamManager() {
    var TeamStore   = miitoo.get('TeamStore');

    var TeamManager = miitoo.get('TeamManager');
    var UserManager = miitoo.get('UserManager');
    
    var primus = miitoo.get('Primus');
    
    // Handle get informations of an user
    function onGetUser(spark, team) {
        spark.on('team:user', function(data) {
            TeamStore.findUser(team, data.id, function(err, user){
                spark.write({
                    event: 'team:user',
                    user: user
                });
            });
        });
    }

    // Handle get informations of users
    function onGetUsers(spark, team) {
        spark.on('team:users', function(data) {
            TeamStore.findUsers(team, function(err, users){
                spark.write({
                    event: 'team:users',
                    users: users
                });
            });
        });
    }

    // Handle update informations of team
    function onUpdateTeam(spark, team) {
        // On update
        spark.on('team:update', function(data) {
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
    }

    function onInvite(spark, team) {
        function inviteNotDone(err) { 
            if(err)
            {
                miitoo.logger.error(err);
            }

            spark.write({
                event: 'team:invite',
                done:  false
            });
        }

        spark.on('team:invite', function(data) {
            var email = data.email;

            UserManager.findUserByEmailOrCreate(email, function(err, user) {
                if(err) 
                {
                    inviteNotDone(err);
                    return;
                }

                var roles = ['USER'];

                TeamStore.addUser(team, user, roles, function(errAdd) {
                    if(errAdd) 
                    {
                        inviteNotDone(err);
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
    }

    function onRemove(spark, team) {
        spark.on('team:remove', function(data) {
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
    }

    function onPromote(spark, team) {
        spark.on('team:promote', function(data) {
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
    }

    function onDemote(spark, team) {
        spark.on('team:demote', function(data) {
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
    }

    // On user connection
    primus.on('connection', function(spark) {
        var team = spark.request.team;

        // Handle get user
        onGetUser(spark, team);

        // Handle get users
        onGetUsers(spark, team);

        // Handle update team
        onUpdateTeam(spark, team);

        // Handle invite in team
        onInvite(spark, team);

        // Handle remove from team
        onRemove(spark, team);

        // Handle promote from team
        onPromote(spark, team);

        // Handle demote from team
        onDemote(spark, team);
    });
};
