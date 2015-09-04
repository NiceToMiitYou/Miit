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

    alert: function(title, content, onAgree, onCancel) {
        var self    = this,
            name    = 'alert-popin',
            onClick = function() {
                self.close(name);
            };

        var options = {
            title:             title,
            content:           content,
            size:              'small',
            on_agree:          onAgree,
            on_cancel:         onCancel,
            on_click:          onClick,
            overlay_closeable: false
        };

        setTimeout(function() {
            var action = {
                type:    ActionTypes.ALERT_MODAL,
                name:    name,
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

