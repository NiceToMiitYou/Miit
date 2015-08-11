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
    statics: {
        getLinkList: function() {
            return ['return'];
        }
    },

    getDefaultProps: function () {
        return {
            text: {
                title:       'Questionnaire',
                name:        'Nom',
                description: 'Description'
            }  
        };
    },

    getInitialState: function () {
        return {
            quiz: null
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

        return (
            <div className="miit-component quiz-show">
                <h2>{this.props.text.title} - {quiz.name}</h2>

                <If test={quiz.description}>
                    <p>{quiz.description}</p>
                </If>

                <QuizShowQuestions quiz={quiz.id} questions={quiz.questions} />
            </div>
        );
    }
});

PageStore.registerApplicationPage('quiz', 'show', QuizShow);

module.exports = QuizShow;
