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
var QuizShow            = require('templates/quiz-show.jsx'),
    QuizUpdateQuestions = require('templates/quiz-update-questions.jsx');

var QuizUpdate = React.createClass({
    statics: {
        getLinkList: function() {
            return ['return'];
        }
    },

    getDefaultProps: function () {
        return {
            text: {
                informations: 'Informations',
                title:        'Modifier',
                name:         'Nom',
                description:  'Description',
                submit:       'Sauvegarder',
                publish:      'Publier',
                close:        'Cloturer',
                published:    'Publié',
                closed:       'Cloturé'
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

    onClose: function() {
        var quiz = this.state.quiz;

        QuizActions.close(quiz.id);
    },

    onPublish: function() {
        var quiz = this.state.quiz;

        QuizActions.publish(quiz.id);
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
                <h2>{this.props.text.title} - {quiz.name}


                    <If test={quiz.published && !quiz.closed}>
                        <span className="ml15 text-green">{this.props.text.published}</span>
                    </If>
                    <If test={quiz.published && quiz.closed}>
                        <span className="ml15 text-red">{this.props.text.closed}</span>
                    </If>
                </h2>

                <div className="col-md-6 mb30">
                    <h3 className="mb20">{this.props.text.informations}</h3>
                    <form onSubmit={this.handleSubmit}>
                        <label className="input-field">
                            {this.props.text.name}
                            <input type="text" name="name" value={value_name} onChange={this.handleChange} className={classesName}/>
                        </label>

                        <label className="input-field mt20">
                            {this.props.text.description}
                            <textarea type="text" name="description" onChange={this.handleChange} defaultValue={value_description}></textarea>
                        </label>

                        <button className="btn btn-info mt20" type="submit"><i className="fa fa-floppy-o mr5"></i> {this.props.text.submit}</button>

                        <If test={!quiz.published}>
                            <button className="btn btn-success mt20" onClick={this.onPublish} type="button"><i className="fa fa-paper-plane-o mr5"></i> {this.props.text.publish}</button>
                        </If>

                        <If test={quiz.published && !quiz.closed}>
                            <button className="btn btn-danger mt20" onClick={this.onClose} type="button"><i className="fa fa-lock-o mr5"></i> {this.props.text.close}</button>
                        </If>
                    </form>

                    <QuizShow quiz={quiz} preview={true} />
                </div>

                <div className="col-md-6">
                    <If test={!quiz.closed}>
                        <QuizUpdateQuestions quiz={quiz.id} questions={quiz.questions} />
                    </If>
                </div>
            </div>
        );
    }
});

PageStore.registerApplicationPage('quiz', 'update', QuizUpdate);

module.exports = QuizUpdate;
