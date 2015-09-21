'use strict';

module.exports = function SessionManager() {
    // Get stores
    var SessionStore = miitoo.get('SessionStore');

    // Get the dispatcher
    var Dispatcher = miitoo.get('RealtimeDispatcher');
    var primus = miitoo.get('Primus');


    // Handle the status of the user
    Dispatcher.register('incoming::ping', 'USER', function onHeartBeat(spark, data, team, user) {
        miitoo.logger.debug('Heartbeat from', user.id);

        // Log the user
        SessionStore.log(team, user);
    });
};
