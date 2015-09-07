'use strict';

var WallConstants = {
    ActionTypes: KeyMirror({
        ADD_COMMENT: null,
        ALLOW_COMMENT: null,
        DISALLOW_COMMENT: null,
        REMOVE_COMMENT: null,
        ADD_QUESTION: null,
        LIKE_QUESTION: null,
        UNLIKE_QUESTION: null,
        I_LIKE_QUESTION: null,
        I_UNLIKE_QUESTION: null,
        ANSWERED_QUESTION: null,
        UNANSWERED_QUESTION: null,
        REMOVE_QUESTION: null,
        REFRESH_QUESTIONS: null
    })
};

module.exports = WallConstants;