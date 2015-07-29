'use strict';

// Include requirements
var Dispatcher             = require('core/lib/dispatcher'),
    NotificationsConstants = require('core/constants/notifications-constants');

// Shortcut
var ActionTypes = NotificationsConstants.ActionTypes;

// Expose the actions
module.exports = {
    new: function(type, text) {
        var action = {
            type: ActionTypes.NEW_NOTIFICATION,
            category: type || 'info',
            text: text
        };

        Dispatcher.dispatch(action);
    }
};