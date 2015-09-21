'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store');

// Include requirements
var QuizValidation = require('apps/quiz/validation'),
    QuizActions    = require('quiz-actions'),
    QuizStore      = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include templates
var QuizStatsQuestionsItem = require('templates/quiz-stats-questions-item.jsx');

var QuizStatsQuestions = React.createClass({
    getDefaultProps: function () {
        return {
            quiz: '',
            questions: []
        };
    },

    render: function() {
        // Get questions
        var questions = this.props.questions,
            counter   = 0;

        return (
            <div className="miit-component quiz-stats-questions">
                <div className="list">
                    {questions.map(function(question) {
                        var key = 'question-' + question.id;
                        
                        // If no answer, do not display
                        if(question.answers.length === 0) {
                            return null;
                        }

                        counter++;

                        return <QuizStatsQuestionsItem ref={key} key={key} counter={counter} question={question} quiz={this.props.quiz} />;
                    }, this)}
                </div>
            </div>
        );
    }
});

module.exports = QuizStatsQuestions;
