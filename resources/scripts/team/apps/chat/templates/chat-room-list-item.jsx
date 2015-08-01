'use strict';

// Include core requirements
var UserStore          = MiitApp.require('core/stores/user-store'),
    SubscriptionsStore = MiitApp.require('core/stores/subscriptions-store');

// Include requirements
var ChatActions = require('chat-actions');

// Include common components
var If       = MiitApp.require('templates/if.jsx'),
    Dropdown = MiitApp.require('templates/dropdown.jsx');

var ChatRoomListItem = React.createClass({
    getDefaultProps: function () {
        return {
            chatroom: {
                id:   '',
                name: ''
            },
            active: false,
            onChange: function() {},
            text: {
                remove: 'Supprimer'
            }
        };
    },

    componentDidMount: function () {
        SubscriptionsStore.addSubscriptionsUpdatedListener(this._onChange);
    },

    componentWillUnmount: function () {
        SubscriptionsStore.removeSubscriptionsUpdatedListener(this._onChange);
    },

    _onChange: function() {
        this.forceUpdate();
    },

    onRemove: function() {
        var isAdmin  = UserStore.isAdmin();

        if(true === isAdmin) {
            var chatroomId = this.props.chatroom.id;

            ChatActions.delete(chatroomId);
        }
    },

    onChange: function() {
        // Propagate the change
        this.props.onChange(this.props.chatroom);
    },

    render: function() {
        var chatroom = this.props.chatroom;
        var isAdmin  = UserStore.isAdmin();
        var unread   = SubscriptionsStore.getUnreadBySender(chatroom.id);

        var classes  = classNames('miit-component chat-room-list-item', (true === this.props.active) ? 'active' : ''); 

        return (
            <span className={classes} onClick={this.onChange}>
                <span className="chatroom-name">{chatroom.name}</span>
                <If test={unread > 0}>
                    <span className="notification">{unread}</span>
                </If>
                <If test={isAdmin}>
                    <Dropdown label="">
                        <span onClick={this.onRemove}>{this.props.text.remove}</span>
                    </Dropdown>
                </If>
            </span>
        );
    }
});

module.exports = ChatRoomListItem;
