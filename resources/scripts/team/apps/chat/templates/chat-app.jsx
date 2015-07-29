'use strict';

// Include requirements
var ChatStore   = require('chat-store'),
    ChatActions = require('chat-actions');

// Include components
var ChatRoomList    = require('templates/chat-room-list.jsx'),
    ChatMessageList = require('templates/chat-message-list.jsx'),
    ChatMessageSend = require('templates/chat-message-send.jsx');

var ChatApp = React.createClass({
    getInitialState: function() {
        return {
            current: {}
        };
    },

    onChange: function(chatroom) {
        this.setState({
            current: chatroom
        });
    },

    inChatroom: function() {
        return !!this.state.current.id;
    },

    render: function() {
        return (
            <span className="miit-component chat-app">
                <ChatRoomList onChange={this.onChange} inChatroom={this.inChatroom} />
                <h1>{this.state.current.name}</h1>
                <ChatMessageList chatroom={this.state.current.id} />
                <ChatMessageSend chatroom={this.state.current.id} />
            </span>
        );
    }
});

module.exports = ChatApp;
