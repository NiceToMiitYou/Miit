'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store'),
    Charts    = MiitApp.require('core/lib/charts'),
    Doughnut  = Charts.charts.Doughnut;

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include templates
var QuizStatsAnswersItem = require('templates/quiz-stats-answers-item.jsx');

var QuizStatsAnswers = React.createClass({
    getDefaultProps: function () {
        return {
            quiz:     '',
            question: {},
            text: {
                title: 'Réponses'
            },
            answers: []
        };
    },

    render: function() {
        // Get answers
        var answers  = this.props.answers || [],
            question = this.props.question,
            quizId   = this.props.quiz;

        if(0 === answers.length) {
            return null;
        }

        var data = answers.map(function(answer, index) {
            var stats = QuizStore.getStatsOfAnswer(quizId, answer.id);

            return {
                id:        answer.id,
                value:     stats.count,
                label:     answer.title,
                color:     Charts.color(index),
                highlight: Charts.highlight(index)
            };
        });

        return (
            <div className="miit-component quiz-stats-answers">
                
                <If test={3 !== question.kind}>
                    <div className="chart-container row">
                        <div className="chart-holder col-sm-5">
                            <Doughnut ref="chart" data={data} redraw />
                        </div>

                        <ul className="chart-legend col-sm-7">
                            {data.map(function(infos) {

                                var key   = question.id + '-' + infos.id,
                                    style = {
                                        backgroundColor: infos.color
                                    };

                                return (
                                    <li key={key}> <div className="colored-square" style={style}></div> {infos.label}</li>
                                );
                            })}
                        </ul>
                    </div>
                </If>

                <div className="answers-list">
                    {answers.map(function(answer) {
                        if(2 !== answer.kind) {
                            return null;
                        }

                        // Generate the key of the answer
                        var key = 'answer-' + question.id + '-' + answer.id;
                        
                        return <QuizStatsAnswersItem ref={key} key={key} answer={answer} quiz={quizId} question={question} />;
                    }, this)}
                </div>
            </div>
        );
    }
});

module.exports = QuizStatsAnswers;
