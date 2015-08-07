'use strict';

// Include core requirements
var UserStore    = MiitApp.require('core/stores/user-store'),
    PageStore    = MiitApp.require('core/stores/page-store'),
    ModalActions = MiitApp.require('core/actions/modal-actions');

// Include requirements
var QuizStore = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var QuizUpdate = React.createClass({
    statics: {
        getLinkList: function() {
            return ['return'];
        }
    },

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
                title:  'Modifer'
            }  
        };
    },

    render: function() {
        var quizId = PageStore.getArgument(),
            quiz   = QuizStore.getQuiz(quizId);

        console.log(quiz);
 
        return (
            <div className="miit-component quiz-update">
                <h2>{this.props.text.title} - {quiz.name}</h2>
            </div>
        );
    }
});

PageStore.registerApplicationPage('quiz', 'update', QuizUpdate);

module.exports = QuizUpdate;
