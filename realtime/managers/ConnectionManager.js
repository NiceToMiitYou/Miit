'use strict';

module.exports = function ConnectionManager() {
    var StatusStore = miitoo.get('StatusStore');
    
    var primus       = miitoo.get('Primus');
    var applications = miitoo.get('Applications');
    var Dispatcher   = miitoo.get('RealtimeDispatcher');

    function initializeConnections(spark, user, team) {
        // Bind event from client
        spark.on('data', function (data){
            miitoo.logger.info(data);

            if(spark.reserved(data.event)) return;

            Dispatcher.dispatch(spark, data.event, data);
        });

        // Check statut
        checkStatuts(spark);

        // Bind status
        onGetStatus(spark);
    }

    function onStatusChanged(team) {
        return function(err, status, changed) {
            if(changed) {
                primus.in(team._id).write({
                    event:  'user:status',
                    status: status
                });
            }
        }
    }

    function onGetStatus(spark) {

        spark.on('users:status', function() {
            var user = spark.request.user;
            var team = spark.request.team;
            
            miitoo.logger.debug('Status asked by User', user.id);

            StatusStore.getStatus(team, function(err, status){
                spark.write({
                    event:  'users:status',
                    status: status
                });
            });
        });
    }

    // Add a status check on ping
    function checkStatuts(spark) {
        spark.on('incoming::ping', function() {
            var user = spark.request.user;
            var team = spark.request.team;

            miitoo.logger.debug('Heartbeat from', user.id);

            StatusStore.setUserOnline(user, team, onStatusChanged(team));
        });
    }

    // On user connection
    primus.on('connection', function(spark) {
        miitoo.logger.info('Someone is connected.');

        var user = spark.request.user;
        var team = spark.request.team;

        var apps = team.applications || [];

        // Join the team room
        spark.join(team._id);

        // Initialize other components
        initializeConnections(spark);

        apps.forEach(function(identifier) {
            var app = applications[identifier];

            // Join the app room
            spark.join(team._id + ':' + identifier);

            if(app && typeof app.onConnection === 'function') {
                app.onConnection(spark);
            }
        });
        
        // Set the user Online
        StatusStore.setUserOnline(user, team, onStatusChanged(team));
    });

    // On user disconnection
    primus.on('disconnection', function(spark) {
        miitoo.logger.info('Someone is disconnected.');

        var user = spark.request.user;
        var team = spark.request.team;

        var apps = team.apps || [];

        apps.forEach(function(identifier) {
            var app = applications[identifier];

            if(typeof app.onDisconnection === 'function') {
                app.onDisconnection(spark);
            }
        });

        // Set the user Offline when detected
        StatusStore.setUserOffline(user, team, onStatusChanged(team));
    });
};
