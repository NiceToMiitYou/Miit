
var ChatRoomListItem = React.createClass({
    getDefaultProps: function () {
        return {
            chatroom: {
                id:   '',
                name: ''
            },
            onChange: function() {}
        };
    },

    onChange: function() {
        // Propagate the change
        this.props.onChange(this.props.chatroom);
    },

    render: function() {
        var chatroom = this.props.chatroom;

        return (
            <span className="miit-component chat-room-list-item" onClick={this.onChange}>
                {chatroom.name}
            </span>
        );
    }
});

module.exports = ChatRoomListItem;
