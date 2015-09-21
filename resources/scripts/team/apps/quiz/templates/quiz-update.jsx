'use strict';

// Include core requirements
var UserStore            = MiitApp.require('core/stores/user-store'),
    NotificationsActions = MiitApp.require('core/actions/notifications-actions'),
    PageStore            = MiitApp.require('core/stores/page-store');

// Include requirements
var QuizActions  = require('quiz-actions'),
    QuizStore    = require('quiz-store'),
    ModalActions = MiitApp.require('core/actions/modal-actions');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include templates
var QuizList              = require('templates/quiz-list.jsx'),
    QuizShow              = require('templates/quiz-show.jsx'),
    QuizUpdateQuestions   = require('templates/quiz-update-questions.jsx'),
    QuizUpdateAddQuestion = require('templates/quiz-update-add-question.jsx');

var QuizUpdate = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                informations:    'Informations',
                title:           'Modifier',
                name:            'Nom',
                create_question: 'Ajouter une question',
                saveQuiz:        'Votre quiz a bien été sauvegardé.',
                description:     'Description',
                submit:          'Sauvegarder',
                publish:         'Publier',
                close:           'Cloturer',
                reopen:          'Ré-ouvrir',
                published:       'Publié',
                closed:          'Cloturé'
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
        PageStore.addPageClosedListener(this.handleSubmit);
        this._onChange();
    },

    componentWillUnmount: function() {
        QuizStore.removeQuizzesRefreshedListener(this._onChange);
        PageStore.removePageClosedListener(this.handleSubmit);
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
        if(e){
            e.preventDefault();
        }

        if(false === UserStore.isAdmin()) {
            return;
        }

        // Save all questions
        var questions = this.refs['questions'];

        if(questions) {
            questions.saveAll();
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

        NotificationsActions.notify('success', this.props.text.saveQuiz);
    },

    onCreateQuestion: function(e) {
        var questions = this.refs['questions'];

        ModalActions.open('quiz-update-add-question', <QuizUpdateAddQuestion questions={questions} />, {
            title: this.props.text.create_question,
            size:  'small'
        });
    },

    onClose: function() {
        var quiz = this.state.quiz;

        QuizActions.close(quiz.id);
    },

    onReopen: function() {
        var quiz = this.state.quiz;

        QuizActions.reopen(quiz.id);
    },

    onPublish: function() {
        var quiz = this.state.quiz;

        QuizActions.publish(quiz.id);
    },

    render: function() {
        if(false === UserStore.isAdmin()) {
            return <QuizList />
        }

        var quiz = this.state.quiz;

        if(!quiz) {
            return null;
        }

        // Get values
        var value_name        = this.state.value_name,
            value_description = this.state.value_description;

        // Get errors
        var classesName = classNames(this.state.error_name ? 'invalid' : '');

        return (
            <div className="miit-component quiz-update">
                <div className="quiz-update-wrapper">
                    <div className="quiz-update-questions container-fluid">
                        <div className="page-title mb30">
                            <h2>{this.props.text.title} - {quiz.name}

                                <If test={quiz.published && !quiz.closed}>
                                    <span className="ml15 quiz-status text-green">{this.props.text.published}</span>
                                </If>
                                <If test={quiz.published && quiz.closed}>
                                    <span className="ml15 quiz-status text-red">{this.props.text.closed}</span>
                                </If>
                            </h2>
                        </div>

                        <div className="panel mb30">
                            <h2 className="panel-title">{this.props.text.informations}</h2>
                            <form onSubmit={this.handleSubmit} className="mb20 panel-content">
                                <label className="input-field">
                                    {this.props.text.name}
                                    <input type="text" name="name" value={value_name} onChange={this.handleChange} className={classesName}/>
                                </label>

                                <label className="input-field mt20">
                                    {this.props.text.description}
                                    <textarea type="text" name="description" onChange={this.handleChange} defaultValue={value_description}></textarea>
                                </label>
                            </form>

                        </div>

                        <If test={!quiz.closed}>
                            <QuizUpdateQuestions ref="questions" quiz={quiz.id} questions={quiz.questions} />
                        </If>
                    </div>
                </div>

                <div className="quiz-update-actions">

                    <button type="button"  className="btn btn-info pull-left ml20" onClick={this.onCreateQuestion} >
                        <i className="fa fa-plus mr5"></i> {this.props.text.create_question}
                    </button>

                    <button className="btn btn-success mr20" onClick={this.handleSubmit} type="button">
                        <i className="fa fa-floppy-o mr5"></i> {this.props.text.submit}
                    </button>

                    <If test={!quiz.published}>
                        <button className="btn btn-info mr20" onClick={this.onPublish} type="button">
                            <i className="fa fa-paper-plane-o mr5"></i> {this.props.text.publish}
                        </button>
                    </If>

                    <If test={quiz.published && !quiz.closed}>
                        <button className="btn btn-danger mr20" onClick={this.onClose} type="button">
                            <i className="fa fa-lock-o mr5"></i> {this.props.text.close}
                        </button>
                    </If>

                    <If test={quiz.published && quiz.closed}>
                        <button className="btn btn-warning mr20" onClick={this.onReopen} type="button">
                            <i className="fa fa-lock-o mr5"></i> {this.props.text.reopen}
                        </button>
                    </If>
                </div>
            </div>
        );
    }
});

PageStore.registerApplicationPage('quiz', 'update', QuizUpdate);

module.exports = QuizUpdate;
