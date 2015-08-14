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
            value_kind: 1
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var answers = nextProps.answers;

        this.setState({
            answers: answers || []
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

    handleCreateAnswer: function(e) {
        e.preventDefault();

        // Get all answers
        var answers = this.state.answers;

        // If the there is a not created answer
        if(-1 !== answers.indexBy('id', 'new')) {
            return;
        }

        // Define a new answer
        var answer = {
            id:       'new',
            title:    '',
            kind:     +this.state.value_kind,
            order:    answers.length
        };

        // Add the answer to the bottom
        answers.push(answer);

        // Refresh
        this.setState({
            answers: answers
        });
    },

    handleRemoveNotSaved: function() {
        // Get the all answers
        var answers = this.state.answers;

        // Question with id "new" are not yet created
        answers.removeBy('id', 'new');

        // Refresh
        this.setState({
            answers: answers
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
            questionId = this.props.question;

        // Get value
        var value_kind = this.state.value_kind;

        return (
            <div className="miit-component quiz-update-answers">
                <h4>{this.props.text.title}</h4>
                
                <div className="list">
                    {answers.map(function(answer) {
                        var key = 'answer-' + questionId + '-' + answer.id;

                        return <QuizUpdateAnswersItem ref={key} key={key} answer={answer} quiz={this.props.quiz} question={questionId} removeNew={this.handleRemoveNotSaved} />;
                    }, this)}
                </div>

                <div className="add-answer">
                    <select name="kind" value={value_kind} onChange={this.handleChange}>
                        <option value="1">{this.props.text.types.classic}</option>
                        <option value="2">{this.props.text.types.open}</option>
                    </select>

                    <button type="button" onClick={this.handleCreateAnswer}>
                        {this.props.text.create_answer}
                    </button>
                </div>
            </div>
        );
    }
});

module.exports = QuizUpdateAnswers;
