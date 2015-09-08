'use strict';

// Include core requirements
var UserStore            = MiitApp.require('core/stores/user-store'),
    NotificationsActions = MiitApp.require('core/actions/notifications-actions');

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
                title:              'Questions',
                save:               'Soumettre',
                saveQuizSuccess:    'Vos réponses ont bien été sauvegardées',
                saveQuizError:      'Impossible de sauvegarder vos réponses, verifiez les questions obligatoires',
            },
            questions: [],
            preview:   false
        };
    },

    getInitialState: function () {
        return {
            errors: []
        };
    },

    saveAnswers: function() {
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

            NotificationsActions.notify('danger', this.props.text.saveQuizError);
        
            return;
        } 

        // Get clean choices
        var choices = validation.getChoices();

        // Save the answer
        var processing = QuizActions.sendChoices(this.props.quiz, choices);

        if(true === processing) {
            NotificationsActions.notify('success', this.props.text.saveQuizSuccess);
        }
    },

    render: function() {
        // Get questions
        var questions = this.props.questions,
            preview   = this.props.preview,
            errors    = this.state.errors,
            counter   = 0;

        return (
            <div className="miit-component quiz-show-questions">
                <div className="list">
                    {questions.map(function(question) {
                        var key   = 'question-' + question.id,
                            error = errors.findBy('question', question.id);
                        
                        // If no answer, do not display
                        if(question.answers.length === 0) {
                            return null;
                        }

                        counter++;

                        return <QuizShowQuestionsItem ref={key} key={key} counter={counter} question={question} quiz={this.props.quiz} error={error} />;
                    }, this)}
                </div>

                <If test={!preview}>
                    <div className="actions">
                        <button type="button" className="btn btn-success" onClick={this.saveAnswers}>
                            <i className="fa fa-floppy-o mr5"></i> {this.props.text.save}
                        </button>
                    </div>
                </If>
            </div>
        );
    }
});

module.exports = QuizShowQuestions;
