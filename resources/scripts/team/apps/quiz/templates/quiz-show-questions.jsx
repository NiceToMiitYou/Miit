'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store');

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include templates
var QuizShowQuestionsItem = require('templates/quiz-show-questions-item.jsx');

var QuizShowQuestions = React.createClass({
    getDefaultProps: function () {
        return {
            quiz: '',
            text: {
                title: 'Questions',
                save:  'Tout sauvegarder',
                types: {
                    unique:   'Question à choix unique',
                    multiple: 'Question à choix multiple',
                    open:     'Question ouverte'
                }
            },
            questions: []
        };
    },

    getAnswers: function() {
        var refs    = this.refs,
            answers = [];

        for(var i in refs) {
            var answer = refs[i].getAnswers();

            answers.push(answer);
        }

        console.log(answers);

        return answers;
    },

    render: function() {
        // Get questions
        var questions = this.props.questions;

        return (
            <div className="miit-component quiz-show-questions">
                <h3>{this.props.text.title}</h3>
                
                <div className="list">
                    {questions.map(function(question) {
                        var key = 'question-' + question.id;

                        return <QuizShowQuestionsItem ref={key} key={key} question={question} quiz={this.props.quiz} />;
                    }, this)}
                </div>

                <div className="actions">
                    <button type="button" onClick={this.getAnswers}>
                        {this.props.text.save}
                    </button>
                </div>
            </div>
        );
    }
});

module.exports = QuizShowQuestions;
