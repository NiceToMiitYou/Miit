'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    ActionTypes = require('core/constants/notifications-constants').ActionTypes;

// Expose the actions
module.exports = {
    notify: function(type, text) {
        setTimeout(function() {
            var action = {
                type:     ActionTypes.NEW_NOTIFICATION,
                category: type || 'info',
                text:     text
            };

            Dispatcher.dispatch(action);
        });
    }
};