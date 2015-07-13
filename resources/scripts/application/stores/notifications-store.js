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

function _addNotification(notification, onRemoved) {
    Notifications.push(notification);

    setTimeout(function(){
        // Popout the notification
        Notifications.shift();
        // Emit the removed event
        onRemoved();
    }, 5000);
}

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
            _addNotification(notification, NotificationsStore.emitNotificationRemoved);

            // Emit the notification
            NotificationsStore.emitNotificationAdded(); 
            break;
    }
});

module.exports = NotificationsStore;
