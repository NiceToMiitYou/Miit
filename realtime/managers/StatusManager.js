'use strict';

module.exports = function StatusManager() {
    var StatusStore = miitoo.get('StatusStore');

    var Dispatcher = miitoo.get('RealtimeDispatcher');

    var primus = miitoo.get('Primus');

    // Publish the event
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

    // Handle get informations of the user
    Dispatcher.register('incoming::ping', 'USER', function onHeartBeat(spark, data, team, user) {

        miitoo.logger.debug('Heartbeat from', user.id);

        // Set the user online
        StatusStore.setUserOnline(user, team, onStatusChanged(team));
    });

    // Handle get status
    Dispatcher.register('users:status', 'USER', function onGetStatus(spark, data, team, user) {
        
        miitoo.logger.debug('Status asked by User', user.id);

        StatusStore.getStatus(team, function(err, status) {
            spark.write({
                event:  'users:status',
                status: status
            });
        });
    });

    // Handle disconnection
    Dispatcher.register('disconnection', 'USER', function onDisconnection() {

        // Set the user Offline when detected
        StatusStore.setUserOffline(user, team, onStatusChanged(team));
    });
};
