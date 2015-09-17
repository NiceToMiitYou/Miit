'use strict';

module.exports = function ConnectionManager() {
    var primus       = miitoo.get('Primus');
    var applications = miitoo.get('Applications');
    var Dispatcher   = miitoo.get('RealtimeDispatcher');

    // On user connection
    primus.on('connection', function(spark) {
        miitoo.logger.info('Someone is connected.');

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
    });

    // On user disconnection
    primus.on('disconnection', function(spark) {
        // Dispatch the disconnection
        Dispatcher.dispatch(spark, 'disconnection', {}, true);

        miitoo.logger.info('Someone is disconnected.');
    });
};
