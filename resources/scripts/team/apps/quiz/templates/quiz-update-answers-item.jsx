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
                submit: 'Sauvegarder',
                placeholder: 'Entrez ici votre réponse'
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

    sendToParent: function() {

        if(!this.debounced) {

            this.debounced = Debounce(function() {

                var title = this.state.value_title;

                this.props.onChange(title);
            }.bind(this), 250)
        }

        this.debounced();
    },
    
    handleChange: function(e) {
        if(e.target && e.target.name) {
            var update = {};
            var name   = 'value_' + e.target.name;
            var value  = e.target.value || '';

            update[name] = value;

            this.setState(update);

            if('new' === this.state.answer.id) {
                this.sendToParent();
            }
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

        // Get errors
        var classesName = classNames(this.state.error_title ? 'invalid' : '');

        return (
            <div className="miit-component quiz-update-answers-item">
                <form onSubmit={this.handleSubmit}>
                    <label className="input-field left-icon">
                        <i className="no-icon">{counter}</i>
                        <input type="text" name="title" value={value_title} onChange={this.handleChange} placeholder={this.props.text.placeholder} className={classesName} />
                        <span className="remove-answer" onClick={this.handleRemoveAnswer}><i className="fa fa-trash text-red"></i></span>
                    </label>
                </form>
            </div>
        );
    }
});

module.exports = QuizUpdateAnswersItem;
