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
        quizzes: data.quizzes,
        choices: data.choices
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

var refresh = Debounce(function() {
    Realtime.send('quiz:quizzes');
}, 250);

// Ask for refresh on the notification from the server
Realtime.on('quiz:refresh', refresh);

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
    },

    close: function(id) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(!id) {
            return false;
        }

        Realtime.send('quiz:close', {
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

        Realtime.send('quiz:publish', {
            id: id
        });

        return true;
    },

    update: function(id, name, description) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(!id || !name || !name.trim()) {
            return false;
        }

        Realtime.send('quiz:update', {
            id:          id,
            name:        name,
            description: description
        });

        return true;
    },

    addQuestion: function(quiz, title, subtitle, kind, order, required) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(
            !quiz ||
            'string' !== typeof title ||
            'string' !== typeof subtitle ||
            (kind !== 1 && kind !== 2 && kind !== 3) ||
            !title || !title.trim()
        ) {
            return false;
        }

        Realtime.send('quiz:questions:add', {
            quiz:     quiz,
            title:    title.trim(),
            subtitle: subtitle.trim(),
            kind:     kind,
            order:    order,
            required: required
        });

        return true;
    },

    updateQuestion: function(quiz, question, title, subtitle, order, required) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(
            !quiz || !question ||
            'string' !== typeof title ||
            'string' !== typeof subtitle ||
            !title || !title.trim()
        ) {
            return false;
        }

        Realtime.send('quiz:questions:update', {
            quiz:     quiz,
            question: question,
            title:    title.trim(),
            subtitle: subtitle.trim(),
            order:    order,
            required: required
        });

        return true;
    },

    removeQuestion: function(quiz, question) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(!quiz || !question) {
            return false;
        }

        Realtime.send('quiz:questions:remove', {
            quiz:     quiz,
            question: question
        });

        return true;
    },

    addAnswer: function(quiz, question, title, kind, order) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(
            !quiz || !question ||
            'string' !== typeof title ||
            (kind !== 1 && kind !== 2) ||
            !title || !title.trim()
        ) {
            return false;
        }

        Realtime.send('quiz:answers:add', {
            quiz:     quiz,
            question: question,
            title:    title.trim(),
            kind:     kind,
            order:    order
        });

        return true;
    },

    updateAnswer: function(quiz, question, answer, title, order) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(
            !quiz || !question || !answer ||
            'string' !== typeof title ||
            !title || !title.trim()
        ) {
            return false;
        }

        Realtime.send('quiz:answers:update', {
            quiz:     quiz,
            question: question,
            answer:   answer,
            title:    title.trim(),
            order:    order
        });

        return true;
    },

    removeAnswer: function(quiz, question, answer) {
        if(false === UserStore.isAdmin()) {
            return;
        }

        if(!quiz || !question || !answer) {
            return false;
        }

        Realtime.send('quiz:answers:remove', {
            quiz:     quiz,
            question: question,
            answer:   answer
        });

        return true;
    },

    sendChoices: function(quiz, choices) {
        if(!quiz || !choices) {
            return false;
        }

        Realtime.send('quiz:choices', {
            quiz:    quiz,
            choices: choices
        });

        return true;
    }
};