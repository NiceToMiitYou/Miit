'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store');

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include templates
var QuizShowAnswersItem = require('templates/quiz-show-answers-item.jsx');

var QuizShowAnswers = React.createClass({
    getDefaultProps: function () {
        return {
            quiz:     '',
            question: {},
            text: {
                title: 'Réponses',
                types: {
                    classic: 'Réponse classique',
                    open:    'Réponse ouverte'
                }
            },
            answers: []
        };
    },

    getInitialState: function () {
        var quiz    = this.props.quiz,
            choices = [];

        this.props.answers.forEach(function(answer) {
            // Check if selected
            if(QuizStore.isChoiced(quiz, answer.id)) {

                var choice = QuizStore.getChoice(quiz, answer.id),
                    result = {
                        id: choice.id
                    };

                // Find a text
                var text = choice.extra.findBy('key', 'text');

                if(text) {
                    result.text = text.value;
                }

                choices.push(result);
            }
        });

        return {
            choices: choices
        };
    },

    handleChange: function(e) {
        var answerId = e.target.value, extra = false;

        // Extract open answer
        if('text' === e.target.type) {
            var values = e.target.name.split('-');

            extra    = answerId;
            answerId = values[2];
        }

        if(-1 !== this.props.answers.indexBy('id', answerId)) {
            var choices = this.state.choices;

            var answer = {
                id: answerId
            };

            if(false !== extra) {
                answer['text'] = extra;
            }

            switch(this.props.question.kind) {
                case 1:
                case 3:
                    choices = [answer];
                    break;

                case 2: 
                    if(-1 === choices.indexBy('id', answerId)) {
                        choices.mergeBy('id', answer);
                    } else {
                        choices.removeBy('id', answerId);
                    }
                    break;
            }

            // Save the choice
            this.setState({
                choices: choices
            });
        }
    },

    getChoices: function() {
        return this.state.choices;
    },

    render: function() {
        // Get answers
        var answers  = this.props.answers,
            question = this.props.question,
            quizId   = this.props.quiz,
            choices  = this.state.choices;

        return (
            <div className="miit-component quiz-show-answers">
                <div className="list">
                    {answers.map(function(answer) {
                        // Generate the key of the answer
                        var key = 'answer-' + question.id + '-' + answer.id;
                        
                        // Extract choice
                        var choice = choices.findBy('id', answer.id);

                        return <QuizShowAnswersItem ref={key} key={key} answer={answer} quiz={quizId} question={question} choice={choice} onChange={this.handleChange} />;
                    }, this)}
                </div>
            </div>
        );
    }
});

module.exports = QuizShowAnswers;
