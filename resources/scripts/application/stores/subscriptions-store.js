'use strict';

// Include requirements
var Dispatcher             = require('application/dispatcher'),
    SubscriptionsConstants = require('application/constants/subscriptions-constants');

// Shortcut
var ActionTypes = SubscriptionsConstants.ActionTypes;

// List of events
var events = KeyMirror({
    SUBSCRIPTIONS_UPDATED: null
});

// Global variables
var Subscriptions = [];

// Refresh subscriptions
function _replaceSubscriptions(subscriptions) {
    Subscriptions = subscriptions || [];
}

// Delete all subscriptions of the application to mark as read
function _deleteByApplication(application) {
    Subscriptions.removeBy('application', application);
}

// Delete all subscriptions of the sender to mark as read
function _deleteBySender(sender) {
    Subscriptions.removeBy('sender', sender);
}

// The SubscriptionsStore Object
var SubscriptionsStore = ObjectAssign({}, EventEmitter.prototype, {
    getUnreadByApplication: function(application) {
        return Subscriptions.map(function(subscription) {
            // If not the good application
            if(subscription.application !== application) {
                return 0;
            }

            return subscription.unread || 0;
        }).reduce(function(prev, next) {
            // Sum values
            return prev + next;
        }, 0);
    },

    getUnreadBySender: function(sender) {
        return Subscriptions.map(function(subscription) {
            // If not the good sender
            if(subscription.sender !== sender) {
                return 0;
            }

            return subscription.unread || 0;
        }).reduce(function(prev, next) {
            // Sum values
            return prev + next;
        }, 0);
    }
});

// Register Functions based on event
SubscriptionsStore.generateNamedFunctions(events.SUBSCRIPTIONS_UPDATED);

// Handle actions
SubscriptionsStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.REFRESH_SUBSCRIPTIONS:
            // refresh subscriptions
            _replaceSubscriptions(action.subscriptions);

            // Emit the update
            SubscriptionsStore.emitSubscriptionsUpdated(); 
            break;

        case ActionTypes.MARK_READ_APPLICATION:
            // delete from the application
            _deleteByApplication(action.application);

            // Emit the update
            SubscriptionsStore.emitSubscriptionsUpdated(); 
            break;

        case ActionTypes.MARK_READ_SENDER:
            // delete from the sender
            _deleteBySender(action.sender);

            // Emit the update
            SubscriptionsStore.emitSubscriptionsUpdated(); 
            break;
    }
});

module.exports = SubscriptionsStore;
