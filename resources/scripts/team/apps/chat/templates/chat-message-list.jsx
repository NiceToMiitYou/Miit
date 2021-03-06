'use strict';

// Include core requirements
var SubscriptionsActions = MiitApp.require('core/actions/subscriptions-actions');

// Include requirements
var ChatStore   = require('chat-store'),
    ChatActions = require('chat-actions');

// Include components
var ChatMessageListEmpty = require('templates/chat-message-list-empty.jsx'),
    ChatMessageListItem  = require('templates/chat-message-list-item.jsx');

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
    Loaded:         false,

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
        // Detach scroll events
        this.detachScrollListener();

        // detach messages handler
        ChatStore.removeNewMessageListener(this._onChanged);
        ChatStore.removeOldMessagesListener(this._onRefresh);
    },

    scrollListener: function() {
        if(!this.isMounted()) {
            return;
        }

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
        var el = this.getDOMNode();

        if(el.addEventListener)
        {
            el.addEventListener('scroll', this.scrollListenerDebounce, false); 
        }
        else if(el.attachEvent)
        {
            el.attachEvent('onscroll', this.scrollListenerDebounce);
        }
    },

    detachScrollListener: function () {
        var el = this.getDOMNode();

        if(el.removeEventListener)
        {
            el.removeEventListener('scroll', this.scrollListenerDebounce, false); 
        }
        else if(el.detachEvent)
        {
            el.detachEvent('onscroll', this.scrollListenerDebounce);
        }
    },

    _onChanged: function() {
        // Mark loaded
        this.Loaded = true;

        // Mark new messages
        this.HasNewMessages = true;

        // Refresh the page
        this.forceUpdate();
    },

    _onRefresh: function() {
        // Mark loaded
        this.Loaded = true;

        // Refresh the page
        this.forceUpdate();
    },

    _stick: function() {
        if(typeof this.state.chatroom === 'undefined') {
            return;
        }

        var el = this.getDOMNode();

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
        var messages = ChatStore.getFormatedMessages(this.state.chatroom),
            empty    = null;

        if(true === this.Loaded && 0 === messages.length) {
            empty = <ChatMessageListEmpty />;
        }

        return (
            <div className="miit-component chat-message-list">
                {empty}
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
