'use strict';

// Include core requierments
var PageStore = MiitApp.require('core/stores/page-store');

// Include requirements
var ChatStore   = require('chat-store'),
    ChatActions = require('chat-actions');

// Include components
var ChatRoomList    = require('templates/chat-room-list.jsx'),
    ChatMessageList = require('templates/chat-message-list.jsx'),
    ChatMessageSend = require('templates/chat-message-send.jsx');

var ChatRoom = React.createClass({
    getInitialState: function () {
        return {
            current: {}
        };
    },

    componentDidMount: function() {
        PageStore.addPageChangedListener(this._onChange);
        ChatStore.addChatroomsRefreshedListener(this._onChange);
        this._onChange();
    },

    componentWillUnmount: function() {
        PageStore.removePageChangedListener(this._onChange);
        ChatStore.removeChatroomsRefreshedListener(this._onChange);
    },

    _onChange: function() {
        if(this.isMounted()) {
            var id = PageStore.getArgument();

            if(id && this.state.current.id !== id) {

                this.setState({
                    current: ChatStore.getChatroom(id) || {}
                });
            }
        }
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
            <div className="miit-component chat-room">
                <ChatRoomList onChange={this.onChange} current={this.state.current} inChatroom={this.inChatroom} />
                <h2>{this.state.current.name}</h2>
                <ChatMessageList chatroom={this.state.current.id} />
                <ChatMessageSend chatroom={this.state.current.id} />
            </div>
        );
    }
});

PageStore.registerApplicationPage('chat', 'room', ChatRoom);

module.exports = ChatRoom;
