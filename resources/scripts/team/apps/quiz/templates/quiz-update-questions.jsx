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
            questions: this.props.questions || [],
            to_create: null,
            asked_new: 0,
            kind:      1
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


        if(
            1 === this.state.asked_new || 
            0  <  this.state.asked_new && !to_create
        ) {
            setTimeout(this.handleCreateQuestion.bind(this, this.state.kind));
        }
    },

    handleCreateQuestion: function(kind, e) {
        if(e) {
            e.preventDefault();
        }

        // If the latest question is not created, do not add more questions
        if(this.state.to_create) {

            // Save all
            this.saveAll();
            
            // Remember choices
            this.setState({
                kind:      kind,
                asked_new: this.state.asked_new + 1
            });
            return;
        }

        // Define a new question
        var question = {
            id:       'new',
            title:    '',
            subtitle: '',
            kind:     kind,
            required: false,
            answers:  [],
            order:    this.state.questions.length
        };

        // Refresh
        this.setState({
            to_create: question,
            asked_new: false,
            kind:      kind
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

        if(!to_create && 0 === questions.length) {
            return null;
        }

        return (
            <div className="miit-component quiz-update-questions panel">
                <h2 className="panel-title">{this.props.text.title}</h2>
                
                <div className="list panel-content">

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
