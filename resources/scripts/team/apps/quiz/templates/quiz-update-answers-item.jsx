'use strict';

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var QuizUpdateAnswersItem = React.createClass({
    getDefaultProps: function () {
        return {
            quiz:     '',
            question: '',
            answer:   {},
            text: {
                delete: 'Supprimer' 
            },
            removeNew: function(){}
        };
    },

    getInitialState: function () {
        var answer = this.props.answer;

        return {
            answer:      answer,
            value_title: answer.title,
            error_title: false
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var answer = nextProps.answer;

        this.setState({
            answer:      answer,
            value_title: answer.title,
            error_title: false
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

    handleRemoveAnswer: function(e) {
        e.preventDefault();

        // Get the quiz, question and the answer
        var quiz     = this.props.quiz,
            question = this.props.question,
            answer   = this.state.answer;

        if('new' === answer.id) {
            // Remove from local list
            this.props.removeNew();
        } else {
            // Remove the question
            QuizActions.removeAnswer(quiz, question, answer.id);
        }
    },

    handleSubmit: function(e) {
        if(e) {
            e.preventDefault();
        }

        this.setState({
            error_title: false
        });

        // Get values
        var title = this.state.value_title;

        if(!title || !title.trim()) {
            this.setState({
                error_title: true
            });
            return;
        }

        // Get the quiz and the question
        var quiz     = this.props.quiz,
            question = this.props.question,
            answer   = this.state.answer;
            
        // Create if new
        if('new' === answer.id) {
            QuizActions.addAnswer(quiz, question, title, answer.kind, answer.order);
            
        } else { // Update if exist

            QuizActions.updateAnswer(quiz, question, answer.id, title, answer.order);
        }
    },

    render: function() {
        // Get answer
        var answer  = this.state.answer,
            counter = this.props.counter;

        // Get values
        var value_title = this.state.value_title;

        // Is the answer already created
        var isCreated = ('new' !== answer.id);

        // Get errors
        var classesName = classNames(this.state.error_title ? 'invalid' : '');

        return (
            <div className="miit-component quiz-update-answers-item">
                <form onSubmit={this.handleSubmit}>
                    <label className="input-field">
                        {counter + '.'}
                        <input type="text" name="title" value={value_title} onChange={this.handleChange} className={classesName} onBlur={this.handleSubmit} />
                    </label>

                    <div className="actions mt10">
                        <button className="btn btn-danger" onClick={this.handleRemoveAnswer}>{this.props.text.delete}</button>
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = QuizUpdateAnswersItem;
