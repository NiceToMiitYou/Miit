'use strict';

// Include core requirements
var PageStore = MiitApp.require('core/stores/page-store'),
    UserStore = MiitApp.require('core/stores/user-store');

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

var QuizCreate = React.createClass({
    statics: {
        getLinkList: function() {
            return ['return'];
        }
    },

    render: function() {
        return (
            <div className="miit-component quiz-create">
                Create
            </div>
        );
    }
});

PageStore.registerApplicationPage('quiz', 'create', QuizCreate);

module.exports = QuizCreate;
