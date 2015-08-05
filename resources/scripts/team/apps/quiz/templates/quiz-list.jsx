'use strict';

// Include core requirements
var PageStore = MiitApp.require('core/stores/page-store');

// Include requirements
var QuizStore   = require('quiz-store');

var QuizList = React.createClass({
    statics: {
        getLinkList: function() {
            return ['create'];
        }
    },

    render: function() {
        var quizzes = QuizStore.getQuizzes();

        return (
            <div className="miit-component quiz-list">
                List
                {quizzes.map(function(quiz) {
                    return null;
                })}
            </div>
        );
    }
});

module.exports = QuizList;
