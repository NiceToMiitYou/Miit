
// Include requirements
var ChatStore   = require('application/stores/chat-store'),
    ChatActions = require('application/actions/chat-actions');

var ChatRoomList = React.createClass({
    getDefaultProps: function () {
        return {
            inChatroom: function() { return true; },
            onChange:   function() {}
        };
    },

    componentDidMount: function() {
        ChatStore.addChatroomsRefreshedListener(this._onChanged);
        ChatActions.refresh();
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
        var chatrooms = ChatStore.getChatrooms();

        return (
            <span className="miit-component chat-room-list">
                {chatrooms.map(function(chatroom) {
                    return (
                        <span key={chatroom.id}>
                            {chatroom.name}
                        </span>
                    );
                })}
            </span>
        );
    }
});

module.exports = ChatRoomList;
