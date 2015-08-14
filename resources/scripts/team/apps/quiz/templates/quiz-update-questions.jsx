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
                create_question: 'Ajouter une question',
                save:            'Tout sauvegarder',
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

        // Get all questions
        var questions = this.state.questions;

        // If the latest question is not created, do not add more questions
        if(-1 !== questions.indexBy('id', 'new')) {
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
        // Get all questions
        var questions = this.state.questions;

        // Question with id "new" are not yet created
        questions.removeBy('id', 'new');

        // Refresh
        this.setState({
            questions: questions
        });
    },

    saveAll: function() {
        var refs = this.refs;

        for(var i in refs) {
            refs[i].handleSubmit();
            refs[i].saveAnswers();
        }
    },

    render: function() {
        // Get questions
        var questions = this.state.questions,
            counter   = 0;

        // Get value
        var value_kind = this.state.value_kind;

        return (
            <div className="miit-component quiz-update-questions">
                <h3 className="mb20">{this.props.text.title}</h3>
                
                <div className="list">
                    {questions.map(function(question) {
                        var key = 'question-' + question.id;

                        counter++;

                        return <QuizUpdateQuestionsItem ref={key} key={key} counter={counter} question={question} quiz={this.props.quiz} removeNew={this.handleRemoveNotSaved} />;
                    }, this)}
                </div>

                <div className="add-question">
                    <select name="kind" value={value_kind} onChange={this.handleChange}>
                        <option value="1">{this.props.text.types.unique}</option>
                        <option value="2">{this.props.text.types.multiple}</option>
                        <option value="3">{this.props.text.types.open}</option>
                    </select>

                    <button type="button"  className="btn btn-info" onClick={this.handleCreateQuestion}>
                        <i className="fa fa-plus mr5"></i> {this.props.text.create_question}
                    </button>
                </div>

                <div className="actions mt20">
                    <button type="button" className="btn btn-info" onClick={this.saveAll}>
                        <i className="fa fa-floppy-o mr5"></i> {this.props.text.save}
                    </button>
                </div>
            </div>
        );
    }
});

module.exports = QuizUpdateQuestions;
