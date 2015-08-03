'use strict';

// Include core requirements
var Dispatcher = MiitApp.require('core/lib/dispatcher');

// Include requirement
var QuizConstants = require('quiz-constants');

// Shortcut
var ActionTypes = QuizConstants.ActionTypes;

// List of events
var events = KeyMirror({
    // Events on quiz event
    QUIZZES_REFRESHED: null
});

// Global variables
var Quizzes = [];

function _refreshQuizzes(quizzes) {
    Quizzes = quizzes || [];    
}

function _addQuiz(quiz) {
    Quizzes.mergeBy('id', quiz);
}

function _updateQuiz(quiz) {
    // Remove the quiz from the list and re-add it
    Quizzes.removeBy('id', quiz.id);

    // Re-add the quiz
    _addQuiz(quiz)
}

// The QuizStore Object
var QuizStore = ObjectAssign({}, EventEmitter.prototype, {
    getQuizzes: function() {
        return Quizzes || [];
    }
});

// Register Functions based on event
QuizStore.generateNamedFunctions(events.QUIZZES_REFRESHED);

// Handle actions
QuizStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.REFRESH_QUIZZES:
            _refreshQuizzes(action.quizzes);
            QuizStore.emitQuizzesRefreshed();
            break;
        
        case ActionTypes.ADD_QUIZ:
            _addQuiz(action.quiz);
            QuizStore.emitQuizzesRefreshed();
            break;

        case ActionTypes.UPDATE_QUIZ:
            _updateQuiz(action.quiz);
            QuizStore.emitQuizzesRefreshed();
            break;
    }
});

module.exports = QuizStore;
