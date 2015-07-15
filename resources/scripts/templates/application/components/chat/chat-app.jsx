
// Include requirements
var ChatStore   = require('application/stores/chat-store'),
    ChatActions = require('application/actions/chat-actions');

// Include components
var ChatRoomList    = require('./chat-room-list.jsx'),
    ChatMessageList = require('./chat-message-list.jsx'),
    ChatMessageSend = require('./chat-message-send.jsx');

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
