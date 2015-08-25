'use strict';

// Include core requirements
var Router       = MiitApp.require('core/lib/router'),
    UserStore    = MiitApp.require('core/stores/user-store'),
    ModalActions = MiitApp.require('core/actions/modal-actions');

// Include requirements
var QuizStore = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include template
var QuizListItem = require('templates/quiz-list-item.jsx'),
    QuizCreate   = require('templates/quiz-create.jsx');

var QuizList = React.createClass({
    componentDidMount: function() {
        QuizStore.addQuizzesRefreshedListener(this._onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeQuizzesRefreshedListener(this._onChange);
    },

    _onChange: function() {
        this.forceUpdate();
    },

    getDefaultProps: function () {
        return {
            text: {
                title:  'Liste de quiz',
                create: 'Créer un nouveau quiz'
            }  
        };
    },

    onClickCreate: function() {
        ModalActions.open('quiz-create-new', <QuizCreate />, {
            title: this.props.text.create,
            size:  'small'
        });
    },

    render: function() {
        var quizzes = QuizStore.getQuizzes();

        if(1 === quizzes.length && false === UserStore.isAdmin()) {

            // Get the first id
            var quizId = quizzes[0].id || '';

            setTimeout(function() {
                Router.setRoute('/quiz/show/' + quizId);
            });

            return null;
        }

        return (
            <div className="miit-component quiz-list container-fluid">
                <h2>{this.props.text.title}</h2>
                <If test={UserStore.isAdmin()}>
                    <div className="page-actions">
                        <button className="btn btn-info pull-right" onClick={this.onClickCreate}><i className="fa fa-plus mr5"></i> {this.props.text.create}</button>
                    </div>
                </If>
                <div className="list">
                    {quizzes.map(function(quiz) {
                        return <QuizListItem key={'quiz-' + quiz.id} quiz={quiz} />;
                    })}
                </div>
            </div>
        );
    }
});

module.exports = QuizList;
