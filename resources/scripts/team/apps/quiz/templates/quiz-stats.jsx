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
var QuizList           = require('templates/quiz-list.jsx'),
    QuizStatsQuestions = require('templates/quiz-stats-questions.jsx');

var QuizStats = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                title:       'Résultat du questionnaire',
                name:        'Nom',
                description: 'Description'
            }
        };
    },

    getInitialState: function () {
        return {
            quiz: this.props.quiz
        };
    },

    componentWillMount: function () {
        var quizId = PageStore.getArgument();

        QuizActions.stats(quizId);
    },

    componentDidMount: function() {
        QuizStore.addQuizzesRefreshedListener(this._onChange);
        QuizStore.addStatsRefreshedListener(this._onChange);
        this._onChange();
    },

    componentWillUnmount: function() {
        QuizStore.removeQuizzesRefreshedListener(this._onChange);
        QuizStore.removeStatsRefreshedListener(this._onChange);
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
        if(false === UserStore.isAdmin()) {
            return <QuizList />
        }

        var quiz = this.state.quiz;

        if(!quiz) {
            return null;
        }

        return (
            <div className="miit-component quiz-stats container-fluid">
                <div className="page-title mb30">
                    <h2>
                        {this.props.text.title + ' - ' + quiz.name}
                    
                        <If test={quiz.description}>
                            <span className="mb20 subtitle">{quiz.description}</span>
                        </If>
                    </h2>
                </div>

                <QuizStatsQuestions quiz={quiz.id} questions={quiz.questions} />
            </div>
        );
    }
});

PageStore.registerApplicationPage('quiz', 'stats', QuizStats);

module.exports = QuizStats;
