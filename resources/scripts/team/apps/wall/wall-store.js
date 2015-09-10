'use strict';

// Include core requirements
var Dispatcher = MiitApp.require('core/lib/dispatcher');

// Include requirement
var ActionTypes = require('wall-constants').ActionTypes;

// List of events
var events = KeyMirror({
    // Events on question event
    QUESTION_REFRESHED: null,
    QUESTIONS_REFRESHED: null
});

// Global variables
var Questions = [], Likes = [];

function _refreshQuestions(questions, likes) {
    Questions = questions || [];
    Likes     = likes || [];
}

function _loadMoreQuestions(questions, likes) {
    Questions.mergeBy('id', questions, true);
    Likes.merge(likes, true);
}

function _addQuestion(question) {
    Questions.mergeBy('id', question, true);
}

function _likeQuestion(question) {
    var temp = Questions.findBy('id', question);

    if(temp) {
        // Increase likes
        temp.likes += 1;

        Questions.mergeBy('id', temp, true);
    }
}

function _unlikeQuestion(question) {
    var temp = Questions.findBy('id', question);

    if(temp) {
        // Decrease likes
        temp.likes -= 1;

        Questions.mergeBy('id', temp, true);
    }
}

function _iLikeQuestion(question) {
    Likes.add(question);
}

function _iUnlikeQuestion(question) {
    Likes.remove(question);
}

function _answeredQuestion(question) {
    var temp = Questions.findBy('id', question);

    if(temp) {
        temp.answered = true;

        Questions.mergeBy('id', temp, true);
    }
}

function _unansweredQuestion(question) {
    var temp = Questions.findBy('id', question);

    if(temp) {
        temp.answered = false;

        Questions.mergeBy('id', temp, true);
    }
}

function _removeQuestion(question) {
    Questions.removeBy('id', question);
}

function _addComment(question, comment) {
    var temp = Questions.findBy('id', question);

    if(temp) {
        temp.comments.addBy('id', comment);

        Questions.mergeBy('id', temp, true);
    }
}

function _allowComment(question) {
    var temp = Questions.findBy('id', question);

    if(temp) {
        temp.allowComments = true;

        Questions.mergeBy('id', temp, true);
    }
}

function _disallowComment(question) {
    var temp = Questions.findBy('id', question);

    if(temp) {
        temp.allowComments = false;

        Questions.mergeBy('id', temp, true);
    }
}

function _removeComment(question, comment) {
    var temp = Questions.findBy('id', question);

    if(temp) {
        temp.comments.removeBy('id', comment);
    }
}

// The WallStore Object
var WallStore = ObjectAssign({}, EventEmitter.prototype, {
    getQuestions: function() {
        // Sort questions before return them
        return (Questions || []).sortBy('createdAt', 'desc');
    },

    getQuestion: function(id) {
        return this.getQuestions().findBy('id', id);
    },

    isLiked: function(id) {
        return -1 !== Likes.indexOf(id);
    }
});

// Register Functions based on event
WallStore.generateNamedFunctions(events.QUESTION_REFRESHED);
WallStore.generateNamedFunctions(events.QUESTIONS_REFRESHED);

// Handle actions
WallStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.ADD_COMMENT:
            _addComment(action.question, action.comment);
            WallStore.emitQuestionRefreshed(action.question);
            break;
        
        case ActionTypes.ALLOW_COMMENT:
            _allowComment(action.question);
            WallStore.emitQuestionRefreshed(action.question);
            break;

        case ActionTypes.DISALLOW_COMMENT:
            _disallowComment(action.question);
            WallStore.emitQuestionRefreshed(action.question);
            break;

        case ActionTypes.REMOVE_COMMENT:
            _removeComment(action.question, action.comment);
            WallStore.emitQuestionRefreshed(action.question);
            break;

        case ActionTypes.ADD_QUESTION:
            _addQuestion(action.question);
            WallStore.emitQuestionsRefreshed(1);
            break;

        case ActionTypes.LIKE_QUESTION:
            _likeQuestion(action.question);
            WallStore.emitQuestionRefreshed(action.question);
            break;

        case ActionTypes.UNLIKE_QUESTION:
            _unlikeQuestion(action.question);
            WallStore.emitQuestionRefreshed(action.question);
            break;

        case ActionTypes.I_LIKE_QUESTION:
            _iLikeQuestion(action.question);
            WallStore.emitQuestionRefreshed(action.question);
            break;

        case ActionTypes.I_UNLIKE_QUESTION:
            _iUnlikeQuestion(action.question);
            WallStore.emitQuestionRefreshed(action.question);
            break;

        case ActionTypes.ANSWERED_QUESTION:
            _answeredQuestion(action.question);
            WallStore.emitQuestionRefreshed(action.question);
            break;

        case ActionTypes.UNANSWERED_QUESTION:
            _unansweredQuestion(action.question);
            WallStore.emitQuestionRefreshed(action.question);
            break;

        case ActionTypes.REMOVE_QUESTION:
            _removeQuestion(action.question);
            WallStore.emitQuestionsRefreshed(1);
            break;

        case ActionTypes.REFRESH_QUESTIONS:
            _refreshQuestions(action.questions, action.likes);
            WallStore.emitQuestionsRefreshed(action.questions.length);
            break;

        case ActionTypes.LOAD_MORE_QUESTIONS:
            _loadMoreQuestions(action.questions, action.likes);
            WallStore.emitQuestionsRefreshed(action.questions.length);
            break;
    }
});

module.exports = WallStore;
