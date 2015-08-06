'use strict';

// Include core requirements
var UserStore    = MiitApp.require('core/stores/user-store'),
    PageStore    = MiitApp.require('core/stores/page-store'),
    ModalActions = MiitApp.require('core/actions/modal-actions');

// Include requirements
var QuizStore = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include template
var QuizCreate = require('templates/quiz-create.jsx');

var QuizList = React.createClass({
    statics: {
        getLinkList: function() {
            return ['create'];
        }
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
            title: this.props.text.create
        });
    },

    render: function() {
        var quizzes = QuizStore.getQuizzes();

        return (
            <div className="miit-component quiz-list">
                <h2>{this.props.text.title}</h2>
                <If test={UserStore.isAdmin()}>
                    <span onClick={this.onClickCreate}>{this.props.text.create}</span>
                </If>
                {quizzes.map(function(quiz) {
                    return null;
                })}
            </div>
        );
    }
});

module.exports = QuizList;
