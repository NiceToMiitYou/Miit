'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store');

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include templates
var QuizUpdateAnswersItem = require('templates/quiz-update-answers-item.jsx');

var QuizUpdateAnswers = React.createClass({
    getDefaultProps: function () {
        return {
            quiz:     '',
            question: '',
            text: {
                title:         'Réponses',
                create_answer: 'Ajouter une réponse',
                types: {
                    classic: 'Réponse classique',
                    open:    'Réponse ouverte'
                }
            },
            answers: []
        };
    },

    getInitialState: function () {
        var answers = this.props.answers;

        return {
            answers:    answers || [],
            value_kind: 1,
            to_create:  null,
            asked_new:  false
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var answers   = nextProps.answers,
            to_create = this.state.to_create;

        if(
            to_create && Array.isArray(answers) && answers.length > 0
        ) {
            var latestAnswer = answers[answers.length - 1];

            // If this is the same question, remove it
            if(to_create.title.trim() === latestAnswer.title) {
                to_create = null;
            }
        }

        this.setState({
            answers:   answers || [],
            to_create: to_create
        });

        if(this.state.asked_new) {
            setTimeout(this.handleCreateAnswer);
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

    handleCreateAnswer: function(e) {
        if(e) {
            e.preventDefault();
        }

        // If the there is a not created answer
        if(this.state.to_create) {

            // Save all
            this.saveAll();

            // Remember choices
            this.setState({
                asked_new: true
            });
            return;
        }

        // Define a new answer
        var answer = {
            id:    'new',
            title: '',
            kind:  +this.state.value_kind,
            order: this.state.answers.length
        };

        // Refresh
        this.setState({
            to_create: answer,
            asked_new: false
        });
    },

    handleToCreateChange: function(title) {
        var to_create = this.state.to_create;

        // If the latest question is not created, do not add more questions
        if(!to_create) {
            return;
        }

        // Define a new question
        to_create.title = title;

        // Refresh
        this.setState({
            to_create: to_create
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
        }
    },

    render: function() {
        // Get answers
        var answers    = this.state.answers,
            to_create  = this.state.to_create,
            questionId = this.props.question,
            counter    = 0;

        // Get value
        var value_kind = this.state.value_kind;

        // Generate new Key for react
        var newKey = 'answer-' + questionId + '-new';

        return (
            <div className="miit-component quiz-update-answers">
                <h4>{this.props.text.title}</h4>
                
                <div className="list">

                    {answers.map(function(answer) {
                        var key = 'answer-' + questionId + '-' + answer.id;

                        counter++;

                        return <QuizUpdateAnswersItem ref={key} key={key} counter={counter} answer={answer} quiz={this.props.quiz} question={questionId} />;
                    }, this)}

                    <If test={to_create}>
                        <QuizUpdateAnswersItem ref={newKey} key={newKey} counter={counter + 1} answer={to_create} quiz={this.props.quiz} question={questionId} removeNew={this.handleRemoveNotSaved} onChange={this.handleToCreateChange} />
                    </If>
                </div>

                <div className="add-answer mt20 pl20 pr20">
                    <select name="kind" value={value_kind} onChange={this.handleChange}>
                        <option value="1">{this.props.text.types.classic}</option>
                        <option value="2">{this.props.text.types.open}</option>
                    </select>

                    <button type="button" className="btn btn-info ml10" onClick={this.handleCreateAnswer}>
                        <i className="fa fa-plus mr5"></i> {this.props.text.create_answer}
                    </button>
                </div>
            </div>
        );
    }
});

module.exports = QuizUpdateAnswers;
