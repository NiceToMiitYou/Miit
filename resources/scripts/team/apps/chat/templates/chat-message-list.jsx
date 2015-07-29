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
    IntervalId:     null,
    OldestMessage:  null,
    HasNewMessages: true,
    ScrollHeight:   0,
    IsSticky:       true,

    getInitialState: function () {
        return {
            chatroom: this.props.chatroom
        };
    },

    componentDidMount: function() {
        // Attach messages handler
        ChatStore.addNewMessageListener(this._onChanged);

        // Attach scroll events
        this._stick();
        this.attachScrollListener();

        // Refresh the list for date update
        this.IntervalId = setInterval(this.forceUpdate.bind(this), 15000);
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
        // Clear refresh of the date
        clearInterval(this.IntervalId);

        // detach messages handler
        ChatStore.removeNewMessageListener(this._onChanged);

        // Detach scroll events
        this.detachScrollListener();
    },

    scrollListener: function() {
        var el = this.getDOMNode();
        
        var threshold = el.scrollHeight - el.offsetHeight - 48;

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

            // Detach it by safety
            this.detachScrollListener();

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
        this.getDOMNode().addEventListener('scroll', this.scrollListener);
    },

    detachScrollListener: function () {
        this.getDOMNode().removeEventListener('scroll', this.scrollListener);
    },

    _onChanged: function() {
        // Mark new messages
        this.HasNewMessages = true;

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
        }
        else if(this.ScrollHeight !== el.scrollHeight)
        {
            // Fix the scroll
            el.scrollTop = el.scrollHeight - this.ScrollHeight;
            
            // Save the value
            this.ScrollHeight = el.scrollHeight;
        }
    },

    render: function() {
        var messages = ChatStore.getMessages(this.state.chatroom);

        return (
            <div className="miit-component chat-message-list">
                {messages.map(function(message) {
                    return (
                        <ChatMessageListItem key={message.id} user={message.user} text={message.text} createdAt={message.createdAt} />
                    );
                })}
            </div>
        );
    }
});

module.exports = ChatMessageList;
