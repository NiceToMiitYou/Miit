'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store');

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include templates
var QuizUpdateQuestionsItem = require('templates/quiz-update-questions-item.jsx');

var QuizUpdateQuestions = React.createClass({
    getDefaultProps: function () {
        return {
            quiz: '',
            text: {
                title:           'Questions',
                create_question: 'Ajouter une questions',
                types: {
                    unique:   'Question à choix unique',
                    multiple: 'Question à choix multiple',
                    open:     'Question ouverte'
                }
            },
            questions: []
        };
    },

    getInitialState: function () {
        console.log('REFRESHED:', this.props.questions);
        return {
            questions:  this.props.questions || [],
            value_kind: 1
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            questions: nextProps.questions
        });
    },

    handleChange: function(e) {
        if(e.target && e.target.name) {
            var update = {};
            var name   = 'value_' + e.target.name;
            var value  = e.target.value || '';

            update[name] = value;

            this.setState(update);
        }
    },

    handleCreateQuestion: function(e) {
        e.preventDefault();

        // Get the latest question and all questions
        var questions    = this.state.questions,
            lastQuestion = questions.length - 1;

        // If the latest question is not created, do not add more questions
        if(lastQuestion >= 0 && 'new' === questions[lastQuestion].id) {
            return;
        }

        // Define a new question
        var question = {
            id:       'new',
            title:    '',
            subtitle: '',
            kind:     +this.state.value_kind,
            required: false,
            answers:  [],
            order:    questions.length
        };

        // Add the question to the bottom
        questions.push(question);

        // Refresh
        this.setState({
            questions: questions
        });
    },

    handleRemoveNotSaved: function() {
        // Get the latest question and all questions
        var questions    = this.state.questions,
            lastQuestion = questions.length - 1;

        // Question with id "new" are not yet created
        questions.removeBy('id', 'new');

        // Refresh
        this.setState({
            questions: questions
        });
    },

    render: function() {
        // Get questions
        var questions = this.state.questions;

        // Get value
        var value_kind = this.state.value_kind;

        return (
            <div className="miit-component quiz-update-questions">
                <h3>{this.props.text.title}</h3>
                
                <div className="list">
                    {questions.map(function(question) {
                        return <QuizUpdateQuestionsItem key={'question-' + question.id} question={question} quiz={this.props.quiz} removeNew={this.handleRemoveNotSaved} />;
                    }, this)}
                </div>

                <div className="add-question">
                    <select name="kind" value={value_kind} onChange={this.handleChange}>
                        <option value="1">{this.props.text.types.unique}</option>
                        <option value="2">{this.props.text.types.multiple}</option>
                        <option value="3">{this.props.text.types.open}</option>
                    </select>

                    <button type="button" onClick={this.handleCreateQuestion}>
                        {this.props.text.create_question}
                    </button>
                </div>
            </div>
        );
    }
});

module.exports = QuizUpdateQuestions;