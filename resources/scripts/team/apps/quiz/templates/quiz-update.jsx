'use strict';

// Include core requirements
var UserStore    = MiitApp.require('core/stores/user-store'),
    PageStore    = MiitApp.require('core/stores/page-store');

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include templates
var QuizUpdateQuestions = require('templates/quiz-update-questions.jsx');

var QuizUpdate = React.createClass({
    statics: {
        getLinkList: function() {
            return ['return'];
        }
    },

    getDefaultProps: function () {
        return {
            text: {
                title:       'Modifer',
                name:        'Nom',
                description: 'Description',
                submit:      'Sauvegarder'
            }  
        };
    },

    getInitialState: function () {
        return {
            value_name:        '',
            value_description: '',
            error_name:        false,
            quiz:              null
        };
    },

    componentDidMount: function() {
        QuizStore.addQuizzesRefreshedListener(this._onChange);
        this._onChange();
    },

    componentWillUnmount: function() {
        QuizStore.removeQuizzesRefreshedListener(this._onChange);
    },

    _onChange: function() {
        var quizId = PageStore.getArgument(),
            quiz   = QuizStore.getQuiz(quizId);

        if(!quiz) {
            return;
        }

        // Define the quiz
        this.setState({
            quiz:              quiz,
            value_name:        quiz.name,
            value_description: quiz.description
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

    handleSubmit: function(e) {
        e.preventDefault();

        if(false === UserStore.isAdmin()) {
            return;
        }

        // Reset error
        this.setState({
            error_name: false
        });

        // Get values
        var quizId      = this.state.quiz.id,
            name        = this.state.value_name,
            description = this.state.value_description;

        // Check the name
        if(!name || !name.trim()) {
            this.setState({
                error_name: true
            });
            return;
        }

        // Create the quiz
        var result = QuizActions.update(quizId, name, description);
    },

    render: function() {
        var quiz = this.state.quiz;

        if(false === UserStore.isAdmin() || !quiz) {
            return null;
        }

        // Get values
        var value_name        = this.state.value_name,
            value_description = this.state.value_description;

        // Get errors
        var classesName = classNames(this.state.error_name ? 'invalid' : '');

        return (
            <div className="miit-component quiz-update">
                <h2>{this.props.text.title} - {quiz.name}</h2>

                <form onSubmit={this.handleSubmit}>
                    <label className="ml40">
                        {this.props.text.name}
                        <input type="text" name="name"        value={value_name}        onChange={this.handleChange} className={classesName}/>
                    </label>
                    <label className="ml40">
                        {this.props.text.description}
                        <input type="text" name="description" value={value_description} onChange={this.handleChange} />
                    </label>

                    <button type="submit">{this.props.text.submit}</button>
                </form>

                <QuizUpdateQuestions quiz={quiz.id} questions={quiz.questions} />
            </div>
        );
    }
});

PageStore.registerApplicationPage('quiz', 'update', QuizUpdate);

module.exports = QuizUpdate;
