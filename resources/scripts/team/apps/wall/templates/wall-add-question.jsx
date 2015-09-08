'use strict';

// Include requirements
var ModalActions         = MiitApp.require('core/actions/modal-actions'),
    NotificationsActions = MiitApp.require('core/actions/notifications-actions');

// Include requirements
var WallActions = require('wall-actions');

//Include template
var WallListItem = require('templates/wall-list-item.jsx');

var WallAddQuestion = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                question: 'Votre question:',
                cancel:   'Annuler',
                submit:   'Soumettre',
                asked:    'Votre question vient d\'être posée.',
                notAsked: 'Il semblerait que la question n\'est pas été enregistrée.'
            },
            placeholder: {
                question: ''
            }
        };
    },

    getInitialState: function() {
        return {
            question: ''
        };
    },

    handleChange: function(e) {
        if(e.target) {
            // Update the question
            this.setState({
                question: e.target.value || ''
            });
        }
    },

    handleSubmit: function(e) {
        e.preventDefault();

        var question = this.state.question,
            asked    = WallActions.create(question);

        // If the question is send, reset the message
        if(true === asked) {
            ModalActions.close('wall-ask-question');

            NotificationsActions.notify('success', this.props.text.asked);

            return;
        }

        NotificationsActions.notify('danger', this.props.text.notAsked);
    },

    _onCancel: function() {
        ModalActions.close('wall-ask-question');
    },

    render: function() {
        var question = this.state.question;

        return (
            <div className="miit-component wall-add-question">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        {this.props.text.question}
                        <textarea type="text" className="mt10" defaultValue={question} placeholder={this.props.placeholder.question} onChange={this.handleChange}></textarea>
                    </label>

                    <div className="modal-footer right">
                        <button className="btn btn-success mr15" type="submit">
                            <i className="fa fa-check mr5"></i> {this.props.text.submit}
                        </button>

                        <button className="btn btn-danger" onClick={this._onCancel} type="button">
                            <i className="fa fa-times mr5"></i> {this.props.text.cancel}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = WallAddQuestion