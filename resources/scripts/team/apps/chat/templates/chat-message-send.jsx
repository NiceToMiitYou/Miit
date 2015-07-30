'use strict';

// Include requirements
var ChatActions = require('chat-actions');

var ChatMessageSend = React.createClass({
    getDefaultProps: function () {
        return {
            placeholder: {
                message: 'Votre message...'
            },
            submit: 'Envoyez'
        };
    },

    getInitialState: function() {
        return {
            message: ''
        };
    },

    handleChange: function(e) {
        if(e.target) {
            // Update the message
            this.setState({
                message: e.target.value || ''
            });
        }
    },

    handleSubmit: function(e) {
        e.preventDefault();

        var chatroom = this.props.chatroom;
        var message  = this.state.message;

        var send = ChatActions.send(chatroom, message);

        // If the message is send, reset the message
        if(true === send) {
            this.setState({
                message: ''
            });
        }
    },

    render: function() {
        var message = this.state.message;

        return (
            <form className="miit-component chat-message-send" onSubmit={this.handleSubmit}>
                <input type="text" value={message} placeholder={this.props.placeholder.message} onChange={this.handleChange} />
                <button type="submit" className="btn btn-info pull-right"><i className="fa fa-arrow-circle-o-right"></i></button>
            </form>
        );
    }
});

module.exports = ChatMessageSend;
