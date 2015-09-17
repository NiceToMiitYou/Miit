'use strict';

// Include requirements
var NotificationsActions = MiitApp.require('core/actions/notifications-actions');

// Include requirements
var WallActions = require('wall-actions');

// Include core templates
var UserAvatar = MiitApp.require('core/templates/user/user-avatar.jsx');

var WallAddQuestion = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                submit:   'Soumettre',
                comments: 'Autoriser les commentaires',
                asked:    'Votre question vient d\'être posée.',
                notAsked: 'Il semblerait que la question n\'est pas été enregistrée.'
            },
            placeholder: {
                question: 'Votre question...'
            }
        };
    },

    getInitialState: function() {
        return {
            value_question: '',
            value_allow:    true
        };
    },

    handleChange: function(e) {
        if(e.target) {
            // Update the question
            this.setState({
                value_question: e.target.value || ''
            });
        }
    },

    handleAllow: function() {
        this.setState({
            value_allow: !this.state.value_allow
        });
    },

    handleSubmit: function(e) {
        e.preventDefault();

        var question = this.state.value_question,
            allow    = this.state.value_allow,
            asked    = WallActions.create(question, allow);

        // If the question is send, reset the message
        if(true === asked) {
            // Update the question
            this.setState({
                value_question: '',
                value_allow:    true
            });

            // Reset text area
            React.findDOMNode(this.refs['question-textarea']).value = '';

            // Notify that the question is 
            NotificationsActions.notify('success', this.props.text.asked);

            return;
        }

        NotificationsActions.notify('danger', this.props.text.notAsked);
    },

    render: function() {
        var value_allow    = this.state.value_allow,
            value_question = this.state.value_question;

        return (
            <div className="miit-component wall-add-question">
                <div className="wall-list-item-inner">
                    <div className="wall-item-avatar">
                        <UserAvatar />
                    </div>

                    <div className="wall-item-question">
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                <textarea ref="question-textarea" type="text" className="mt10" defaultValue={value_question} placeholder={this.props.placeholder.question} onChange={this.handleChange}></textarea>
                            </label>

                            <div className="wall-list-item-actions">
                                <label className="checkbox-field mt20 mb20">
                                    <input className="option-input checkbox" type="checkbox" name="required" checked={value_allow} onChange={this.handleAllow} />
                                    {this.props.text.comments}
                                </label>

                                <button className="btn btn-success pull-right" type="submit">
                                    <i className="fa fa-check mr5"></i> {this.props.text.submit}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = WallAddQuestion