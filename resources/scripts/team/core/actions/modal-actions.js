'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    ActionTypes = require('core/constants/modal-constants').ActionTypes;

// Expose the actions
module.exports = {
    open: function(name, element, options) {

        setTimeout(function() {
            var action = {
                type:    ActionTypes.OPEN_MODAL,
                name:    name,
                element: element,
                options: options
            };

            Dispatcher.dispatch(action);
        });
    },

    close: function(name) {
        
        setTimeout(function() {
            var action = {
                type: ActionTypes.CLOSE_MODAL,
                name: name
            };

            Dispatcher.dispatch(action);
        });
    }
};

