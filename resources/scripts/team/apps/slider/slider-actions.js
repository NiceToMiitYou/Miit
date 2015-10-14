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

// Debounces quizzes refresh to avoid flood
var refreshPresentations = Debounce(function() {
    Realtime.send('slider:presentations');
}, 250);

Realtime.on('slider:refresh', refreshPresentations);

// Expose the actions
module.exports = {
    refresh: function() {
        refreshPresentations();
    }
};