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
    QUIZ_CREATED: null,
    QUIZZES_REFRESHED: null,
    STATS_REFRESHED: null
});

// Global variables
var Quizzes = [], Choices = [], Stats = [];

function _refreshQuizzes(quizzes, choices) {
    Quizzes = quizzes || [];
    Choices = choices || [];
}

function _refreshStats(quiz, stats) {
    var temp = {
        id:    quiz,
        stats: stats
    };

    // Add the quiz
    Stats.mergeBy('id', temp, true);
}

function _addQuiz(quiz) {
    Quizzes.mergeBy('id', quiz);
}

function _updateQuiz(quiz) {
    // Remove the quiz from the list and re-add it
    Quizzes.mergeBy('id', quiz, true);
}

// The QuizStore Object
var QuizStore = ObjectAssign({}, EventEmitter.prototype, {
    getQuizzes: function() {
        return Quizzes || [];
    },

    getQuiz: function(id) {
        return Quizzes.findBy('id', id);
    },

    getStats: function(id) {
        return Stats.findBy('id', id) || {};
    },

    getStatsOfAnswer: function(id, answer) {
        var stats = this.getStats(id).stats || [];

        return stats.findBy('id', answer) || { count: 0, extra: [] };
    },

    isAnswered: function(quiz) {
        return !!this.getChoices(quiz);
    },

    getChoices: function(quiz) {
        return Choices.findBy('id', quiz);
    },

    isChoiced: function(quiz, answer) {
        var list = this.getChoices(quiz) || { choices: [] };

        return -1 !== list.choices.indexBy('id', answer);
    },

    getChoice: function(quiz, answer) {
        var list = this.getChoices(quiz) || { choices: [] };

        return list.choices.findBy('id', answer);
    }
});

// Register Functions based on event
QuizStore.generateNamedFunctions(events.QUIZ_CREATED);
QuizStore.generateNamedFunctions(events.QUIZZES_REFRESHED);
QuizStore.generateNamedFunctions(events.STATS_REFRESHED);

// Handle actions
QuizStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.REFRESH_QUIZZES:
            _refreshQuizzes(action.quizzes, action.choices);
            QuizStore.emitQuizzesRefreshed();
            break;

        case ActionTypes.REFRESH_STATS:
            _refreshStats(action.quiz, action.stats);
            QuizStore.emitStatsRefreshed(action.quiz);
            break;
        
        case ActionTypes.ADD_QUIZ:
            var quiz = action.quiz;
            // Add the quiz
            _addQuiz(quiz);
            // Emit the rigth event
            if(true === action.open) {
                QuizStore.emitQuizCreated(quiz.id);
            } else {
                QuizStore.emitQuizzesRefreshed();
            }
            break;

        case ActionTypes.UPDATE_QUIZ:
            _updateQuiz(action.quiz);
            QuizStore.emitQuizzesRefreshed();
            break;
    }
});

module.exports = QuizStore;
