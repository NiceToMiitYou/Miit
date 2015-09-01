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
                open:         'Ouverte',
                openDesc:     'Créer une question ouverte avec une zone de text dans laquelle l\'utilisateur pourra y taper sa réponse',
                unique:       'Unique',
                uniqueDesc:   'Créer une question unique avec une liste de réponsse possibles parmis lesquelles l\'utilisateur ne pourra en choisir qu\'une seule',
                multiple:     'Multiple',
                multipleDesc: 'Créer une question multiple avec une liste de réponses possibles parmis lesquelles l\'utilisateur pourra en choisir une ou plusieurs'
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

                <div className="add-question t1" onClick={this.onClick.bind(this, 1)}>
                    <i className="fa fa-check-circle-o bg-blue-green darken-5"></i> 
                    <div className="add-question-content">
                        <h3>{this.props.text.unique}</h3>
                        <p>{this.props.text.uniqueDesc}</p>
                    </div>
                </div>

                <div className="add-question t2" onClick={this.onClick.bind(this, 2)}>
                    <i className="fa fa-check-square-o"></i>
                    <div className="add-question-content">
                        <h3>{this.props.text.multiple}</h3>
                        <p>{this.props.text.multipleDesc}</p>
                    </div>
                </div>

                <div className="add-question t3" onClick={this.onClick.bind(this, 3)}>
                    <i className="fa fa-keyboard-o bg-purple"></i>
                    <div className="add-question-content">
                        <h3>{this.props.text.open}</h3>
                        <p>{this.props.text.openDesc}</p>
                    </div>
                </div>

            </div>
        );
    }
});

module.exports = QuizCreate;
