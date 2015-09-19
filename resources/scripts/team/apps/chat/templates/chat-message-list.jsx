'use strict';

// Include core requirements
var SubscriptionsActions = MiitApp.require('core/actions/subscriptions-actions');

// Include requirements
var ChatStore   = require('chat-store'),
    ChatActions = require('chat-actions');

// Include components
var ChatMessageListItem = require('templates/chat-message-list-item.jsx');

function topPosition(domElt) {
    if (!domElt) {
        return 0;
    }
    return domElt.offsetTop + topPosition(domElt.offsetParent);
}

var ChatMessageList = React.createClass({
    OldestMessage:  null,
    HasNewMessages: true,
    ScrollHeight:   0,
    IsSticky:       true,

    // Debounced scroll listener
    scrollListenerDebounce: null,

    getInitialState: function () {
        return {
            chatroom: this.props.chatroom
        };
    },

    componentDidMount: function() {
        this.scrollListenerDebounce = Debounce(this.scrollListener, 75);

        // Attach messages handler
        ChatStore.addNewMessageListener(this._onChanged);
        ChatStore.addOldMessagesListener(this._onRefresh);

        this.scrollListener();
        // Attach scroll events
        this._stick();
    },

    componentDidUpdate: function () {
        // Attach scroll events
        this._stick();
        this.attachScrollListener();
    },

    componentWillReceiveProps: function(nextProps) {
        if(this.state.chatroom !== nextProps.chatroom) {
            // Update the state
            this.setState({
                chatroom: nextProps.chatroom
            });

            ChatActions.last(nextProps.chatroom);
        }
    },

    componentWillUnmount: function() {
        // detach messages handler
        ChatStore.removeNewMessageListener(this._onChanged);
        ChatStore.removeOldMessagesListener(this._onChanged);

        // Detach scroll events
        this.detachScrollListener();
    },

    scrollListener: function() {
        var el = this.getDOMNode();
        
        var threshold = el.scrollHeight - el.offsetHeight - 96;

        // Is it stick or not
        if(
            true      === this.IsSticky &&
            threshold  >  el.scrollTop
        ) {
            this.IsSticky = false;
        }
        else if(
            false     === this.IsSticky &&
            threshold  <  el.scrollTop
        ) {
            this.IsSticky = true;
        }

        // Should reload
        if (el.scrollTop <= 128) {

            // load all messages
            var messages = ChatStore.getMessages(this.state.chatroom);

            // Request
            if(0 < messages.length) {
                var message  = messages[0];
                var last     = message.createdAt;

                if(message.id !== this.OldestId) {
                    // Save the oldest id and scroll heigth
                    this.OldestId     = message.id;
                    this.ScrollHeight = el.scrollHeight;

                    ChatActions.messages(this.state.chatroom, last);
                }
            }
        }
    },

    attachScrollListener: function () {
        this.getDOMNode().addEventListener('scroll', this.scrollListenerDebounce);
    },

    detachScrollListener: function () {
        this.getDOMNode().removeEventListener('scroll', this.scrollListenerDebounce);
    },

    _onChanged: function() {
        // Mark new messages
        this.HasNewMessages = true;

        // Refresh the page
        this.forceUpdate();
    },

    _onRefresh: function() {
        // Refresh the page
        this.forceUpdate();
    },

    _stick: function() {
        if(typeof this.state.chatroom === 'undefined') {
            return;
        }

        var el = this.getDOMNode();

        console.log(this.HasNewMessages);
        
        if(true === this.IsSticky) {    
            el.scrollTop = el.scrollHeight;

            if(true === this.HasNewMessages) {
                // Mark new messages
                this.HasNewMessages = false;

                // Mark the chatroom as read
                SubscriptionsActions.markReadSender(this.state.chatroom);
            }

            this.scrollListenerDebounce();
        }
        else if(this.ScrollHeight !== el.scrollHeight)
        {
            if(false === this.HasNewMessages) {
                // Fix the scroll
                el.scrollTop = el.scrollHeight - this.ScrollHeight;
            }
            
            // Save the value
            this.ScrollHeight = el.scrollHeight;
        }
    },

    render: function() {
        var messages = ChatStore.getFormatedMessages(this.state.chatroom);

        return (
            <div className="miit-component chat-message-list">
                {messages.map(function(message) {
                    return (
                        <ChatMessageListItem key={message.id} message={message} />
                    );
                })}
            </div>
        );
    }
});

module.exports = ChatMessageList;
