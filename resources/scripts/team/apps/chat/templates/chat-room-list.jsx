'use strict';

// Include core requirements
var UserStore   = MiitApp.require('core/stores/user-store');

// Include requirements
var ChatStore   = require('chat-store'),
    ChatActions = require('chat-actions');

// Include common components
var If       = MiitApp.require('templates/if.jsx'),
    Dropdown = MiitApp.require('templates/dropdown.jsx');

// Include components
var ChatRoomListItem = require('templates/chat-room-list-item.jsx'),
    ChatRoomCreate   = require('templates/chat-room-create.jsx');

var ChatRoomList = React.createClass({
    getDefaultProps: function () {
        return {
            inChatroom: function() { return true; },
            onChange:   function() {},
            current:    {},
            text: {
                create: "Créer une salle"
            }
        };
    },

    componentDidMount: function() {
        ChatStore.addChatroomsRefreshedListener(this._onChanged);
        ChatActions.rooms();
    },

    componentWillUnmount: function() {
        ChatStore.removeChatroomsRefreshedListener(this._onChanged);
    },

    _onChanged: function() {
        if(!this.props.inChatroom()) {
            var chatrooms = ChatStore.getChatrooms();
            
            this.props.onChange(chatrooms[0] || {});
        }

        this.forceUpdate();
    },

    render: function() {
        // Get informations
        var onChange  = this.props.onChange;
        var chatrooms = ChatStore.getChatrooms();

        // Is the user an admin?
        var isAdmin = UserStore.isAdmin();

        return (
            <span className="miit-component chat-room-list">
                {chatrooms.map(function(chatroom) {
                    var isCurrent = chatroom.id === this.props.current.id;

                    return (
                        <ChatRoomListItem key={chatroom.id} chatroom={chatroom} active={isCurrent} onChange={onChange} />
                    );
                }, this)}

                <If test={isAdmin}>
                    <Dropdown label={this.props.text.create} className="create-room">
                        <ChatRoomCreate />
                    </Dropdown>
                </If>
            </span>
        );
    }
});

module.exports = ChatRoomList;
