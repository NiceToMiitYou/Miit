'use strict';

// Include requirements
var Dispatcher     = require('application/dispatcher'),
    ModalConstants = require('application/constants/modal-constants');

// Shortcut
var ActionTypes = ModalConstants.ActionTypes;

// Expose the actions
global.ModalActions = module.exports = {
    open: function(name, element, options) {
        var action = {
            type:    ActionTypes.OPEN_MODAL,
            name:    name,
            element: element,
            options: options
        };

        Dispatcher.dispatch(action);
    },

    close: function(name) {
        var action = {
            type: ActionTypes.CLOSE_MODAL,
            name: name
        };

        Dispatcher.dispatch(action);
    }
};

