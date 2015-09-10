'use strict';

// Include core requirements
var Dispatcher = MiitApp.require('core/lib/dispatcher'),
    Realtime   = MiitApp.require('core/lib/realtime'),
    UserStore  = MiitApp.require('core/stores/user-store');

// Include requirements
var ActionTypes = require('wall-constants').ActionTypes;

//
// Listen for events
//

Realtime.on('wall:questions:list', function(data) {
    var action = ActionTypes.REFRESH_QUESTIONS;

    if(false === data.refresh) {
        action = ActionTypes.LOAD_MORE_QUESTIONS;
    }

    var action = {
        type:      action,
        questions: data.questions,
        likes:     data.likes
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('wall:questions:new', function(data) {
    var action = {
        type:     ActionTypes.ADD_QUESTION,
        question: data.question
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('wall:questions:like', function(data) {
    var action = {
        type:     ActionTypes.LIKE_QUESTION,
        question: data.question
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('wall:questions:unlike', function(data) {
    var action = {
        type:     ActionTypes.UNLIKE_QUESTION,
        question: data.question
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('wall:questions:ilike', function(data) {
    var action = {
        type:     ActionTypes.I_LIKE_QUESTION,
        question: data.question
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('wall:questions:iunlike', function(data) {
    var action = {
        type:     ActionTypes.I_UNLIKE_QUESTION,
        question: data.question
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('wall:questions:answered', function(data) {
    var action = {
        type:     ActionTypes.ANSWERED_QUESTION,
        question: data.question
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('wall:questions:unanswered', function(data) {
    var action = {
        type:     ActionTypes.UNANSWERED_QUESTION,
        question: data.question
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('wall:questions:remove', function(data) {
    var action = {
        type:     ActionTypes.REMOVE_QUESTION,
        question: data.question
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('wall:comments:create', function(data) {
    var action = {
        type:     ActionTypes.ADD_COMMENT,
        question: data.question,
        comment:  data.comment
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('wall:comments:allow', function(data) {
    var action = {
        type:     ActionTypes.ALLOW_COMMENT,
        question: data.question
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('wall:comments:disallow', function(data) {
    var action = {
        type:     ActionTypes.DISALLOW_COMMENT,
        question: data.question
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

Realtime.on('wall:comments:remove', function(data) {
    var action = {
        type:     ActionTypes.REMOVE_COMMENT,
        question: data.question,
        comment:  data.comment
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

// Debounces documents refresh to avoid flood
var refreshQuestions = Debounce(function(last, count) {
    Realtime.send('wall:questions:list');
}, 250);

Realtime.on('wall:refresh', refreshQuestions);

function simpleAction(eventName) {
    return function(question) {
        if(!question) {
            return false;
        }

        Realtime.send(eventName, {
            id: question
        });

        return true;
    };
}

// Expose the actions
module.exports = {
    refresh: function() {
        refreshQuestions();
    },

    questions: function(last, count) {
        Realtime.send('wall:questions:list', {
            last:  last  || new Date(),
            count: count || 20
        });
    },

    create: function(text) {
        if(!text || !text.trim()) {
            return false;
        }

        Realtime.send('wall:questions:create', {
            text: text.trim()
        });

        return true;
    },

    like:       simpleAction('wall:questions:like'),
    unlike:     simpleAction('wall:questions:unlike'),
    answered:   simpleAction('wall:questions:answered'),
    unanswered: simpleAction('wall:questions:unanswered'),
    remove:     simpleAction('wall:questions:remove'),
    allow:      simpleAction('wall:comments:allow'),
    disallow:   simpleAction('wall:comments:disallow'),

    comment: function(question, text) {
        if(!question || !text || !text.trim()) {
            return false;
        }

        Realtime.send('wall:comments:create', {
            id:   question,
            text: text
        });

        return true;
    },

    uncomment: function(question, comment) {
        if(!question || !comment) {
            return false;
        }

        Realtime.send('wall:comments:remove', {
            id:      question,
            comment: comment
        });

        return true;
    }
};
