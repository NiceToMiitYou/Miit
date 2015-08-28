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
                preview:     'Aperçu',
                description: 'Description',
                answered:    'Complété'
            },
            preview: false
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
        var quiz    = this.state.quiz,
            preview = this.props.preview;

        if(!quiz) {
            return null;
        }

        // get informations of the quiz
        var isAnswered = QuizStore.isAnswered(quiz.id);

        // define classes
        var classes = classNames('miit-component quiz-show container-fluid', (preview) ? 'preview' : '');

        return (
            <div className={classes}>
                <h2 className="mb10">
                    {(preview) ? this.props.text.preview : this.props.text.title} - {quiz.name}

                    <If test={isAnswered}>
                        <span className="quiz-status ml15 text-green pull-right"><i className="fa fa-check-square-o mr10"></i>{this.props.text.answered}</span>
                    </If>
                </h2>

                <If test={quiz.description}>
                    <p className="mb20">{quiz.description}</p>
                </If>

                <QuizShowQuestions quiz={quiz.id} questions={quiz.questions} preview={preview} />
            </div>
        );
    }
});

PageStore.registerApplicationPage('quiz', 'show', QuizShow);

module.exports = QuizShow;
