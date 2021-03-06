'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store'),
    PageStore = MiitApp.require('core/stores/page-store');

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include templates
var QuizShowQuestions = require('templates/quiz-show-questions.jsx');

var QuizShow = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                title:       'Questionnaire',
                name:        'Nom',
                description: 'Description',
                answered:    'Complété'
            }
        };
    },

    getInitialState: function () {
        return {
            quiz: this.props.quiz
        };
    },

    componentDidMount: function() {
        QuizStore.addQuizzesRefreshedListener(this._onChange);
        this._onChange();
    },

    componentWillUnmount: function() {
        QuizStore.removeQuizzesRefreshedListener(this._onChange);
    },

    _onChange: function() {
        var quizId = PageStore.getArgument(),
            quiz   = QuizStore.getQuiz(quizId);

        if(!quiz) {
            return;
        }

        // Define the quiz
        this.setState({
            quiz: quiz
        });
    },

    render: function() {
        var quiz = this.state.quiz;

        if(!quiz) {
            return null;
        }

        // get informations of the quiz
        var isAnswered = QuizStore.isAnswered(quiz.id);

        // define classes
        var classes = classNames('miit-component quiz-show container-fluid');

        return (
            <div className={classes}>
                <div className="page-title mb20">
                    <h2>
                        {this.props.text.title + ' - ' + quiz.name}

                        <If test={isAnswered}>
                            <span className="quiz-status ml15 text-green pull-right"><i className="fa fa-check-square-o mr10"></i>{this.props.text.answered}</span>
                        </If>
                    </h2>
                </div>
                <If test={quiz.description}>
                    <p className="mb20">{quiz.description}</p>
                </If>

                <QuizShowQuestions quiz={quiz.id} questions={quiz.questions} />
            </div>
        );
    }
});

PageStore.registerApplicationPage('quiz', 'show', QuizShow);

module.exports = QuizShow;
