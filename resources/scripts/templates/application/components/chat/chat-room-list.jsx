
// Include requirements
var ChatStore   = require('application/stores/chat-store'),
    ChatActions = require('application/actions/chat-actions'),
    UserStore   = require('application/stores/user-store');

// Include common components
var If       = require('templates/common/if.jsx'),
    Dropdown = require('templates/common/dropdown.jsx');

// Include components
var ChatRoomListItem = require('./chat-room-list-item.jsx'),
    ChatRoomCreate   = require('./chat-room-create.jsx');

var ChatRoomList = React.createClass({
    getDefaultProps: function () {
        return {
            inChatroom: function() { return true; },
            onChange:   function() {},
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
                    return (
                        <ChatRoomListItem key={chatroom.id} chatroom={chatroom} onChange={onChange} />
                    );
                })}

                <If test={isAdmin}>
                    <Dropdown label={this.props.text.create}>
                        <ChatRoomCreate />
                    </Dropdown>
                </If>
            </span>
        );
    }
});

module.exports = ChatRoomList;
