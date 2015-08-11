'use strict';

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include templates
var QuizShowAnswers = require('templates/quiz-show-answers.jsx');

var QuizShowQuestionsItem = React.createClass({
    getDefaultProps: function () {
        return {
            quiz:     '',
            question: {},
            text: {
                submit:   'Sauvegarder',
                title:    'Intitulé',
                subtitle: 'Complément'
            }
        };
    },

    getAnswers: function() {
        var refs = this.refs;

        if(refs['answers']) {
            return {
                id:      this.props.question.id,
                choices: refs['answers'].getChoices()
            };
        }

        return false;
    },

    render: function() {
        // Get question
        var quiz     = this.props.quiz,
            question = this.props.question,
            answers  = question.answers || [];

        // If no answer, do not display
        if(answers.length === 0) {
            return null;
        }

        return (
            <div className="miit-component quiz-show-questions-item">
                {question.title}

                <QuizShowAnswers ref="answers" quiz={quiz} question={question} answers={answers} />
            </div>
        );
    }
});

module.exports = QuizShowQuestionsItem;
