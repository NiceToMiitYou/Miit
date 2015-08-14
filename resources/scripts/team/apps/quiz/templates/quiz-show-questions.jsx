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
            questions: [],
            preview:   false
        };
    },

    getInitialState: function () {
        return {
            errors:     [],
            processing: false
        };
    },

    getAnswers: function() {
        if(true === processing) {
            return;
        }

        // Process the validation
        var refs      = this.refs,
            questions = this.props.questions,
            answers   = [];

        for(var i in refs) {
            var answer = refs[i].getAnswers();

            // Exclude wrong answer
            if(false !== answer) {
                answers.push(answer);
            }
        }

        var validation = new QuizValidation(questions, answers);

        validation.validate();

        // Stop the process if invalid
        if(false === validation.isValid())
        {
            this.setState({
                errors: validation.getErrors()
            });
        
            return;
        }

        // Get clean choices
        var choices = validation.getChoices();

        // Save the answer
        var processing = QuizActions.sendChoices(this.props.quiz, choices);

        this.setState({
            processing: processing
        });
    },

    render: function() {
        // Get questions
        var questions = this.props.questions,
            preview   = this.props.preview,
            errors    = this.state.errors,
            counter   = 0;

        return (
            <div className="miit-component quiz-show-questions">
                <h3>{this.props.text.title}</h3>
                
                <div className="list">
                    {questions.map(function(question) {
                        var key   = 'question-' + question.id,
                            error = errors.findBy('question', question.id);
                        
                        counter++;

                        return <QuizShowQuestionsItem ref={key} key={key} counter={counter} question={question} quiz={this.props.quiz} error={error} />;
                    }, this)}
                </div>

                <If test={!preview}>
                    <div className="actions">
                        <button type="button" onClick={this.getAnswers}>
                            <i className="fa fa-floppy-o mr5"></i> {this.props.text.save}
                        </button>
                    </div>
                </If>
            </div>
        );
    }
});

module.exports = QuizShowQuestions;
