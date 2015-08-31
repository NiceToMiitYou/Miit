'use strict';

// Include core lib
var Router = MiitApp.require('core/lib/router');

// Include core requirements
var PageStore    = MiitApp.require('core/stores/page-store'),
    UserStore    = MiitApp.require('core/stores/user-store'),
    ModalActions = MiitApp.require('core/actions/modal-actions');

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var QuizCreate = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                open:     'Ouverte',
                unique:   'Unique',
                multiple: 'Multiple'
            },
            questions: null
        };
    },

    onClick: function(kind) {
        var questions = this.props.questions;

        if(questions && typeof questions.handleCreateQuestion === 'function') {
            questions.handleCreateQuestion(kind);
        }

        // Close the modal
        ModalActions.close('quiz-update-add-question');
    },

    render: function() {
        if(false === UserStore.isAdmin()) {
            return null;
        }

        return (
            <div className="miit-component quiz-update-add-question">
                <div onClick={this.onClick.bind(this, 1)}>{this.props.text.unique}</div>
                <div onClick={this.onClick.bind(this, 2)}>{this.props.text.multiple}</div>
                <div onClick={this.onClick.bind(this, 3)}>{this.props.text.open}</div>
            </div>
        );
    }
});

module.exports = QuizCreate;
