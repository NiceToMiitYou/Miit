'use strict';

// Include requirements
var Dispatcher             = require('application/dispatcher'),
    NotificationsConstants = require('application/constants/notifications-constants');

// Shortcut
var ActionTypes = NotificationsConstants.ActionTypes;

// List of events
var events = KeyMirror({
    NOTIFICATION_ADDED: null,
    NOTIFICATION_REMOVED: null
});

// Global variables
var Notifications = [];

// The NotificationsStore Object
var NotificationsStore = ObjectAssign({}, EventEmitter.prototype, {
    getNotifications: function() {
        return Notifications;
    }
});

// On Add a notification
function _addNotification(notification, onRemoved) {
    Notifications.push(notification);

    // Emit the notification
    NotificationsStore.emitNotificationAdded(); 

    setTimeout(function(){
        // Popout the notification
        Notifications.shift();
        // Emit the removed event
        NotificationsStore.emitNotificationRemoved();
    }, 5000);
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
            _addNotification(notification);
            break;
    }
});

module.exports = NotificationsStore;
