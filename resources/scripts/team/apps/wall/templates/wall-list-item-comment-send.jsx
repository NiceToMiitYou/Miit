'use strict';

// Include requierements
var NotificationsActions = MiitApp.require('core/actions/notifications-actions');

// Include core templates
var UserAvatar = MiitApp.require('core/templates/user/user-avatar.jsx');

// Include requirements
var WallActions = require('wall-actions');

var WallListItemCommentSend = React.createClass({
    getDefaultProps: function () {
        return {
            question: '',
            text: {
                commented:    'Votre commentaire à bien été envoyé',
                notCommented: 'Votre commentaire n\'a pas pu être'
            },
            placeholder: {
                comment: 'Votre commentaire...'
            }
        };
    },

    getInitialState: function () {
        return {
            comment: ''  
        };
    },

    handleChange: function(e) {
        if(e.target) {
            // Update the comment
            this.setState({
                comment: e.target.value || ''
            });
        }
    },

    handleSubmit: function(e) {
        e.preventDefault();

        var question  = this.props.question,
            comment   = this.state.comment;

        if(!comment || !comment.trim()) {
            return;
        }

        var commented = WallActions.comment(question, comment);

        // If the question is send, reset the message
        if(true === commented) {
            // Update the question
            this.setState({
                comment: ''
            });

            NotificationsActions.notify('success', this.props.text.commented);

            return;
        }

        NotificationsActions.notify('danger', this.props.text.notCommented);
    },

    render: function() {
        var comment = this.state.comment;

        return (
            <form className="miit-component wall-list-item-comment-send" onSubmit={this.handleSubmit}>
                <div className="wall-comment-send-avatar">
                    <UserAvatar />
                </div>

                <label>
                    <input type="text" value={comment} placeholder={this.props.placeholder.comment} onChange={this.handleChange} />
                </label>

                <button type="submit" className="btn btn-info pull-right"><i className="fa fa-arrow-circle-o-right"></i></button>
            </form>
        );
    }
});

module.exports = WallListItemCommentSend;
