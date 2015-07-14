
// Include requirements
var ChatStore   = require('application/stores/chat-store'),
    ChatActions = require('application/actions/chat-actions');

// Include components
var ChatRoomList = require('./chat-room-list.jsx');

var ChatApp = React.createClass({
    getInitialState: function () {
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
                <h1>{this.state.current.id}</h1>
                <ChatRoomList onChange={this.onChange} inChatroom={this.inChatroom} />
            </span>
        );
    }
});

module.exports = ChatApp;
