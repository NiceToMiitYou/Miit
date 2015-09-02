'use strict';

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var QuizStatsAnswersItem = React.createClass({
    getDefaultProps: function () {
        return {
            quiz:     '',
            question: {},
            answer:   {},
            text: {
                answers_for: 'Les réponses pour',
                answers:     'Les réponses à la question',
                no_answer:   'Aucune réponse pour le moment'
            }
        };
    },

    render: function() {
        // Get answer
        var quiz     = this.props.quiz,
            answer   = this.props.answer,
            question = this.props.question;

        if(!quiz || !question || !answer) {
            return null;
        }

        var stats = QuizStore.getStatsOfAnswer(quiz, answer.id),
            extra = [];

        stats.extra.forEach(function(extras) {

            if(!extras) {
                return;
            }

            // Extract all extra information of the answer
            extras.forEach(function(temp) {
                if('text' !== temp['key']) {
                    return null;
                }

                extra.push({
                    text: temp.value
                });
            });
        });

        var title = this.props.text.answers_for + ' ' + answer.title;

        if(!answer.title) {
            title = this.props.text.answers;
        }

        return (
            <div className="miit-component quiz-stats-answers-item">
                <h3 className="user-answers-header mt15 mb20">
                    {title}
                </h3>
                {extra.map(function(infos, index) {
                    var key = 'question-' + question.id + '-answer-' + answer.id + '-' + index;

                    return (
                        <div className="mb10 ml10" key={key} >{index+1 + " - " + infos.text}</div>
                    );
                })}
                <If test={0 === extra.length}>
                    <div className="mb5 ml10 user-answers-empty">
                        {this.props.text.no_answer}
                    </div>
                </If>
            </div>
        );
    }
});

module.exports = QuizStatsAnswersItem;
