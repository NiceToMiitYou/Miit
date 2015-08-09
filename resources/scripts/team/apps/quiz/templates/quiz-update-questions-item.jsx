'use strict';

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var QuizUpdateQuestionsItem = React.createClass({
    getDefaultProps: function () {
        return {
            quiz:     '',
            question: {},
            text: {
                submit:   'Sauvegarder',
                title:    'Intitulé',
                subtitle: 'Complément',
                required: 'Rendre cette question obligatoire',
                delete:   'Supprimer' 
            },
            removeNew: function(){}
        };
    },

    getInitialState: function () {
        var question = this.props.question;

        return {
            question:       question,
            value_title:    question.title,
            value_subtitle: question.subtitle,
            value_required: question.required,
            error_title:    false
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var question = nextProps.question;

        return {
            question:       question,
            value_title:    question.title,
            value_subtitle: question.subtitle,
            value_required: question.required,
            error_title:    false
        };
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

    handleRequired: function() {
        this.setState({
            value_required: !this.state.value_required
        });
    },

    handleRemoveQuestion: function(e) {
        e.preventDefault();

        // Get the quiz and the question
        var quiz     = this.props.quiz,
            question = this.state.question;

        if('new' === question.id) {
            // Remove from local list
            this.props.removeNew();
        } else {
            // Remove the question
            QuizActions.removeQuestion(quiz, question);
        }
    },

    handleSubmit: function(e) {
        e.preventDefault();

        this.setState({
            error_title: false
        });

        // Get values
        var title    = this.state.value_title,
            subtitle = this.state.value_subtitle,
            required = this.state.value_required;

        if(!title || !title.trim()) {
            this.setState({
                error_title: true
            });
            return;
        }

        // Get the quiz and the question
        var quiz     = this.props.quiz,
            question = this.state.question;

        // Create if new
        if('new' === question.id) {
            
            QuizActions.addQuestion(quiz, title, subtitle, question.kind, question.order, required);
            
        } else { // Update if exist

            QuizActions.updateQuestion(quiz, question.id, title, subtitle, question.order, required);
        }
    },

    render: function() {
        // Get question
        var question = this.state.question;

        // Get values
        var value_title    = this.state.value_title,
            value_subtitle = this.state.value_subtitle,
            value_required = this.state.value_required;

        // Is the question already created
        var isCreated = ('new' !== question.id);

        // Get errors
        var classesName = classNames(this.state.error_title ? 'invalid' : '');

        return (
            <div className="miit-component quiz-update-questions-item">
                <form onSubmit={this.handleSubmit}>
                    <label className="ml40">
                        {this.props.text.title}
                        <input type="text" name="title"    value={value_title}    onChange={this.handleChange} className={classesName}/>
                    </label>
                    <label className="ml40">
                        {this.props.text.subtitle}
                        <input type="text" name="subtitle" value={value_subtitle} onChange={this.handleChange} />
                    </label>

                    <label>
                        <input type="checkbox" name="required" checked={value_required} onChange={this.handleRequired} />
                        {this.props.text.required}
                    </label>

                    <div className="actions">
                        <button type="submit">{this.props.text.submit}</button>

                        <button onClick={this.handleRemoveQuestion}>{this.props.text.delete}</button>
                    </div>
                </form>

                <If test={isCreated}>
                    <div className="list">

                    </div>
                </If>
            </div>
        );
    }
});

module.exports = QuizUpdateQuestionsItem;