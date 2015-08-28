'use strict';

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include templates
var QuizStatsAnswers = require('templates/quiz-stats-answers.jsx');

var QuizStatsQuestionsItem = React.createClass({
    getDefaultProps: function () {
        return {
            quiz:     '',
            question: {},
            counter:  1
        };
    },

    render: function() {
        // Get question
        var quiz     = this.props.quiz,
            question = this.props.question,
            counter  = this.props.counter,
            answers  = question.answers || [];

        // If no answer, do not display
        if(answers.length === 0) {
            return null;
        }

        return (
            <div className="miit-component quiz-stats-questions-item panel mb20">
                <h3 className="panel-title">{counter + ' - ' + question.title}</h3>

                <QuizStatsAnswers quiz={quiz} question={question} answers={answers} />
            </div>
        );
    }
});

module.exports = QuizStatsQuestionsItem;
