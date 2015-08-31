'use strict';

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include templates
var QuizUpdateAnswers = require('templates/quiz-update-answers.jsx');

var QuizUpdateQuestionsItem = React.createClass({
    getDefaultProps: function () {
        return {
            quiz:     '',
            question: {},
            counter:  1,
            text: {
                submit:   'Sauvegarder',
                title:    'Entrez l\'intitulé de votre question ici',
                question: 'Question',
                subtitle: 'Ajoutez ici un complément à la question (optionnel)',
                required: 'Rendre cette question obligatoire'
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

        this.setState({
            question:       question,
            value_title:    question.title,
            value_subtitle: question.subtitle,
            value_required: question.required,
            error_title:    false
        });
    },

    sendToParent: function() {

        if(!this.debounced) {

            this.debounced = Debounce(function() {

                var title    = this.state.value_title,
                    subtitle = this.state.value_subtitle,
                    required = this.state.value_required;

                this.props.onChange(title, subtitle, required);
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

            if('new' === this.state.question.id) {
                this.sendToParent();
            }
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
        if(e) {
            e.preventDefault();
        }

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

        // Check for change
        if(
            'new'    !== question.id &&
            title    === question.title &&
            subtitle === question.subtitle &&
            required === question.required
        ) {
            return;
        }

        // Create if new
        if('new' === question.id) {
            
            QuizActions.addQuestion(quiz, title, subtitle, question.kind, question.order, required);
            
        } else { // Update if exist

            QuizActions.updateQuestion(quiz, question.id, title, subtitle, question.order, required);
        }
    },

    saveAnswers: function() {
        var refs = this.refs;

        if(refs['answers']) {
            refs['answers'].saveAll();
        }
    },

    render: function() {
        // Get question
        var question = this.state.question,
            counter  = this.props.counter;

        // Get values
        var value_title    = this.state.value_title,
            value_subtitle = this.state.value_subtitle,
            value_required = this.state.value_required;

        // Is the question already created
        var isCreated = ('new' !== question.id);

        // Get errors
        var classesName = classNames(this.state.error_title ? 'invalid' : '');

        return (
            <div className="miit-component quiz-update-questions-item mb30">
                <span className="remove-question-item text-red"  onClick={this.handleRemoveQuestion}><i className="fa fa-times"></i></span>

                <form onSubmit={this.handleSubmit}>
                    <label className="input-field question-title">
                        <input type="text" name="title" placeholder={this.props.text.title}   value={value_title}    onChange={this.handleChange} className={classesName} />
                    </label>
                    <label className="input-field question-subtitle">
                        <input type="text" name="subtitle" value={value_subtitle} placeholder={this.props.text.subtitle}  onChange={this.handleChange} />
                    </label>

                    <label className="checkbox-field mt20 mb20">
                        <input className="option-input checkbox" type="checkbox" name="required" checked={value_required} onChange={this.handleRequired} />
                        {this.props.text.required}
                    </label>

                </form>

                <If test={isCreated && 3 !== question.kind}>
                    <QuizUpdateAnswers ref="answers" quiz={this.props.quiz} question={this.props.question.id} answers={question.answers} />
                </If>
            </div>
        );
    }
});

module.exports = QuizUpdateQuestionsItem;
