'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    Realtime    = require('core/lib/realtime'),
    ActionTypes = require('core/constants/subscriptions-constants').ActionTypes;

// Listen for the subscriptions list
Realtime.on('subscription:list', function(data) {
    var action = {
        type:          ActionTypes.REFRESH_SUBSCRIPTIONS,
        subscriptions: data.subscriptions
    };

    Dispatcher.dispatch(action);
});

function refresh() {
    Realtime.send('subscription:list');
}

Realtime.on('subscription:new', refresh);

// Expose the actions
module.exports = {
    refresh: refresh,

    markReadApplication: function(application) {
        Realtime.send('subscription:application:read', {
            application: application
        });

        setTimeout(function() {
            var action = {
                type:   ActionTypes.MARK_READ_APPLICATION,
                sender: sender
            };

            Dispatcher.dispatch(action);
        });
    },

    markReadSender: function(sender) {
        Realtime.send('subscription:sender:read', {
            sender: sender
        });

        setTimeout(function() {
            var action = {
                type:   ActionTypes.MARK_READ_SENDER,
                sender: sender
            };

            Dispatcher.dispatch(action);
        });
    }
};