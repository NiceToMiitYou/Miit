
// Include requirements
var ChatActions = require('application/actions/chat-actions'),
    UserStore   = require('application/stores/user-store');

// Include common components
var If       = require('templates/common/if.jsx'),
    Dropdown = require('templates/common/dropdown.jsx');

var ChatRoomListItem = React.createClass({
    getDefaultProps: function () {
        return {
            chatroom: {
                id:   '',
                name: ''
            },
            onChange: function() {},
            text: {
                remove: 'Supprimer'
            }
        };
    },

    _onChange: function() {
        // Propagate the change
        this.props.onChange(this.props.chatroom);
    },

    _onRemove: function() {
        var isAdmin  = UserStore.isAdmin();

        if(true === isAdmin) {
            var chatroomId = this.props.chatroom.id;

            ChatActions.delete(chatroomId);
        }
    },

    render: function() {
        var chatroom = this.props.chatroom;
        var isAdmin  = UserStore.isAdmin();

        return (
            <span className="miit-component chat-room-list-item">
                <span onClick={this._onChange}>{chatroom.name}</span>
                <If test={isAdmin}>
                    <Dropdown label="">
                        <span onClick={this._onRemove}>{this.props.text.remove}</span>
                    </Dropdown>
                </If>
            </span>
        );
    }
});

module.exports = ChatRoomListItem;
