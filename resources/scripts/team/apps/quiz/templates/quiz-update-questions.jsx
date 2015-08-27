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
            to_create:  null,
            value_kind: 1,
            asked_new:  false
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var questions = nextProps.questions,
            to_create = this.state.to_create;

        if(
            to_create && Array.isArray(questions) && questions.length > 0
        ) {
            var latestQuestion = questions[questions.length - 1];

            // If this is the same question, remove it
            if(to_create.title.trim() === latestQuestion.title) {
                to_create = null;
            }
        }

        this.setState({
            questions: questions || [],
            to_create: to_create
        });

        if(this.state.asked_new) {
            setTimeout(this.handleCreateQuestion);
        }
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
        if(e) {
            e.preventDefault();
        }

        // If the latest question is not created, do not add more questions
        if(this.state.to_create) {

            // Save all
            this.saveAll();
            
            // Remember choices
            this.setState({
                asked_new: true
            });
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
            order:    this.state.questions.length
        };

        // Refresh
        this.setState({
            to_create: question,
            asked_new: false
        });
    },

    handleRemoveNotSaved: function() {
        // Refresh
        this.setState({
            to_create: null
        });
    },

    saveAll: function() {
        var refs = this.refs;

        for(var i in refs) {
            refs[i].handleSubmit();
            refs[i].saveAnswers();
        }
    },

    handleToCreateChange: function(title, subtitle, required) {
        var to_create = this.state.to_create;

        // If the latest question is not created, do not add more questions
        if(!to_create) {
            return;
        }

        // Define a new question
        to_create.title    = title;
        to_create.subtitle = subtitle;
        to_create.required = required;

        // Refresh
        this.setState({
            to_create: to_create
        });
    },

    render: function() {
        // Get questions
        var questions = this.state.questions,
            to_create = this.state.to_create,
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

                        return <QuizUpdateQuestionsItem ref={key} key={key} counter={counter} question={question} quiz={this.props.quiz} />;
                    }, this)}

                    <If test={to_create}>
                        <QuizUpdateQuestionsItem ref='question-new' key='question-new' counter={counter + 1} question={to_create} quiz={this.props.quiz} removeNew={this.handleRemoveNotSaved} onChange={this.handleToCreateChange} />
                    </If>
                </div>

            </div>
        );
    }
});

module.exports = QuizUpdateQuestions;
