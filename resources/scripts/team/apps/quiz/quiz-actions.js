'use strict';

// Include core requirements
var Dispatcher = MiitApp.require('core/lib/dispatcher'),
    Realtime   = MiitApp.require('core/lib/realtime'),
    UserStore  = MiitApp.require('core/stores/user-store');

// Include requirements
var ActionTypes = require('quiz-constants').ActionTypes;

//
// Listen for events
//

Realtime.on('quiz:quizzes', function(data) {
    var action = {
        type:    ActionTypes.REFRESH_QUIZZES,
        quizzes: data.quizzes
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('quiz:create', function(data) {
    var action = {
        type: ActionTypes.ADD_QUIZ,
        quiz: data.quiz,
        open: data.open
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('quiz:update', function(data) {
    var action = {
        type: ActionTypes.UPDATE_QUIZ,
        quiz: data.quiz
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

// Ask for refresh on the notification from the server
Realtime.on('quiz:refresh', function() {
    Realtime.send('quiz:quizzes');
});

// Expose the actions
module.exports = {
    refresh: function() {
        Realtime.send('quiz:quizzes');
    },

    create: function(name, description) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(!name || !name.trim()) {
            return false;
        }

        Realtime.send('quiz:create', {
            name:        name,
            description: description
        });

        return true;
    }
};