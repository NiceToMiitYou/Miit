'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    ActionTypes = require('core/constants/notifications-constants').ActionTypes;

// List of events
var events = KeyMirror({
    NOTIFICATION_ADDED: null,
    NOTIFICATION_REMOVED: null
});

// Global variables
var Notifications = [], Enable = true;

// The NotificationsStore Object
var NotificationsStore = ObjectAssign({}, EventEmitter.prototype, {
    getNotifications: function() {
        return Notifications;
    }
});

// On Add a notification
function _addNotification(notification, disable) {
    if(false === Enable) {
        return;
    }

    Notifications.push(notification);

    // Emit the notification
    NotificationsStore.emitNotificationAdded(); 

    setTimeout(function(){
        // Popout the notification
        Notifications.shift();
        // Emit the removed event
        NotificationsStore.emitNotificationRemoved();
    }, 5000);

    if(0 !== disable) {
        Enable = false;

        setTimeout(function(){
            Enable = true;
        }, disable);
    }
}

// Register Functions based on event
NotificationsStore.generateNamedFunctions(events.NOTIFICATION_ADDED);
NotificationsStore.generateNamedFunctions(events.NOTIFICATION_REMOVED);

// Handle actions
NotificationsStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.NEW_NOTIFICATION:
            // Create the notification object
            var notification = {
                id:   MiitUtils.generator.guid(),
                type: action.category,
                text: action.text
            };

            // Add the no
            _addNotification(notification, action.disable);
            break;
    }
});

module.exports = NotificationsStore;
