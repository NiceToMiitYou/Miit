(function(){
    var Notifications = [];

    function _addNotification(notification, onRemoved) {
        Notifications.push(notification);

        setTimeout(function(){
            // Popout the notification
            Notifications.shift();
            // Emit the removed event
            onRemoved();
        }, 5000);
    }

    var MiitNotificationsStore = injector.resolve(
        ['object-assign', 'key-mirror', 'miit-utils', 'miit-dispatcher', 'miit-notifications-constants'],
        function(ObjectAssign, KeyMirror, MiitUtils, MiitDispatcher, MiitNotificationsConstants) {
            // All action types
            var ActionTypes = MiitNotificationsConstants.ActionTypes;

            var events = KeyMirror({
                NOTIFICATION_ADDED: null,
                NOTIFICATION_REMOVED: null
            });

            // The NotificationsStore Object
            var NotificationsStore = ObjectAssign({}, EventEmitter.prototype, {
                getNotifications: function() {
                    return Notifications;
                }
            });

            // Register Functions based on event
            NotificationsStore.generateNamedFunctions(events.NOTIFICATION_ADDED);
            NotificationsStore.generateNamedFunctions(events.NOTIFICATION_REMOVED);

            // Handle actions
            NotificationsStore.dispatchToken = MiitDispatcher.register(function(action){
                switch(action.type) {
                    case ActionTypes.NEW_NOTIFICATION:
                        // Create the notification object
                        var notification = {
                            id:   MiitUtils.generator.guid(),
                            type: action.category,
                            text: action.text
                        };

                        // Add the no
                        _addNotification(notification, NotificationsStore.emitNotificationRemoved);

                        // Emit the notification
                        NotificationsStore.emitNotificationAdded(); 
                        break;
                }
            });

            return NotificationsStore;
        }
    );

    injector.register('miit-notifications-store', MiitNotificationsStore);
})();