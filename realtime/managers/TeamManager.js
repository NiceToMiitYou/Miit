'use strict';

module.exports = function UserManager() {
    var TeamStore = miitoo.get('TeamStore');
    
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
        spark.on('team:update', function(data) {
            var name   = data.name;
            var publix = data.publix;

            if(!name || (true !== publix && false !== publix)) 
            {
                return;
            }

            TeamStore.findTeam(team, function(err, teamToUpdate){


                spark.write({
                    event: 'team:update',
                    users: users
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
    });
};
