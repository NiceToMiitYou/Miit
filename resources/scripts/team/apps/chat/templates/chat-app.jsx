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
        var rooms = ChatStore.getChatrooms();

        if(-1 === rooms.indexBy('id', this.state.current.id)) {
            return false;
        }

        return !!this.state.current.id;
    },

    render: function() {
        return (
            <div className="miit-component chat-app fullheight">
                <ChatRoomList onChange={this.onChange} current={this.state.current} inChatroom={this.inChatroom} />
                <h1>{this.state.current.name}</h1>
                <ChatMessageList chatroom={this.state.current.id} />
                <ChatMessageSend chatroom={this.state.current.id} />
            </div>
        );
    }
});

module.exports = ChatApp;
