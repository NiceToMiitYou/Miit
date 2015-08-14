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
            counter:  1,
            error:    null,
            text: {
                submit:   'Sauvegarder',
                title:    'Intitulé',
                subtitle: 'Complément'
            }
        };
    },

    getInitialState: function () {
        return {
            error: this.props.error  
        };
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({
            error: nextProps.error
        });  
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
            counter  = this.props.counter,
            error    = this.state.error,
            answers  = question.answers || [];

        // If no answer, do not display
        if(answers.length === 0) {
            return null;
        }

        var classes = classNames('miit-component quiz-show-questions-item', (error) ? 'invalid': '');

        return (
            <div className={classes}>
                {counter + ' - ' + question.title}

                <QuizShowAnswers ref="answers" quiz={quiz} question={question} answers={answers} />
            </div>
        );
    }
});

module.exports = QuizShowQuestionsItem;
