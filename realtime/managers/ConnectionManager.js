'use strict';

module.exports = function ConnectionManager() {
    var primus       = miitoo.get('Primus');
    var applications = miitoo.get('Applications');
    var Dispatcher   = miitoo.get('RealtimeDispatcher');

    // On user connection
    primus.on('connection', function(spark) {
        miitoo.logger.info('Someone is connected.');

        var user = spark.request.user;
        var team = spark.request.team;

        var apps = team.applications || [];

        // Bind event from client
        spark.on('data', function (data){
            miitoo.logger.info(data);

            if(spark.reserved(data.event)) return;

            Dispatcher.dispatch(spark, data.event, data);
        });

        // Bind ping event
        spark.on('incoming::ping', function() {

            // Dispatch the ping
            Dispatcher.dispatch(spark, 'incoming::ping', {});
        });

        // Initialize other components
        apps.forEach(function(identifier) {
            var app = applications[identifier];

            // Join the app room
            spark.join(team._id + ':' + identifier);

            if(app && typeof app.onConnection === 'function') {
                app.onConnection(spark);
            }
        });
    });

    // On user disconnection
    primus.on('disconnection', function(spark) {
        // Dispatch the disconnection
        Dispatcher.dispatch(spark, 'disconnection', {});

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
    });
};
