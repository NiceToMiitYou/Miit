'use strict';

// Include core requirements
var Dispatcher = MiitApp.require('core/lib/dispatcher'),
    Realtime   = MiitApp.require('core/lib/realtime'),
    UserStore  = MiitApp.require('core/stores/user-store');

// Include requirements
var ActionTypes = require('slider-constants').ActionTypes;

//
// Listen for events
//

Realtime.on('slider:presentations', function(data) {
    var action = {
        type:          ActionTypes.REFRESH_PRESENTATIONS,
        presentations: data.presentations
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('slider:next', function(data) {
    var action = {
        type:         ActionTypes.NEXT_SLIDE,
        presentation: data.presentation,
        current:      data.current
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('slider:previous', function(data) {
    var action = {
        type:          ActionTypes.PREVIOUS_SLIDE,
        presentation: data.presentation,
        current:      data.current
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

// Debounces quizzes refresh to avoid flood
var refreshPresentations = Debounce(function() {
    Realtime.send('slider:presentations');
}, 250);

Realtime.on('slider:refresh', refreshPresentations);

// Expose the actions
module.exports = {
    refresh: function() {
        refreshPresentations();
    },

    update: function(id, name, description) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(!id || !name) {
            return false;
        }

        Realtime.send('slider:update', {
            id:          id,
            name:        name,
            description: description
        });

        return true;
    },

    close: function(id) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(!id) {
            return false;
        }

        Realtime.send('slider:close', {
            id: id
        });

        return true;
    },

    reopen: function(id) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(!id) {
            return false;
        }

        Realtime.send('slider:reopen', {
            id: id
        });

        return true;
    },

    next: function(id) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(!id) {
            return false;
        }

        Realtime.send('slider:next', {
            id: id
        });

        return true;
    },

    previous: function(id) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(!id) {
            return false;
        }

        Realtime.send('slider:previous', {
            id: id
        });

        return true;
    },

    publish: function(id) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(!id) {
            return false;
        }

        Realtime.send('slider:publish', {
            id: id
        });

        return true;
    }
};