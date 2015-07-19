'use strict';

// Include requirements
var ChatStore   = require('application/stores/chat-store'),
    ChatActions = require('application/actions/chat-actions');

// Include components
var ChatMessageListItem = require('./chat-message-list-item.jsx');

function topPosition(domElt) {
  if (!domElt) {
    return 0;
  }
  return domElt.offsetTop + topPosition(domElt.offsetParent);
}

var ChatMessageList = React.createClass({
    IntervalId: null,

    getInitialState: function () {
        return {
            chatroom: this.props.chatroom,
            stick:    true,
            heigth:   0
        };
    },

    componentDidMount: function() {
        // Attach messages handler
        ChatStore.addNewMessageListener(this._onChanged);

        // Attach scroll events
        this._stick();
        this.attachScrollListener();

        // Refresh the list for date update
        this.IntervalId = setInterval(function() {
            this._onChanged();
        }.bind(this), 15000);
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
            true      === this.state.stick &&
            threshold  >  el.scrollTop
        ) {
            this.setState({
                stick: false
            });
        }
        else if(
            false     === this.state.stick &&
            threshold  <  el.scrollTop
        ) {
            this.setState({
                stick: true
            });
        }

        // Should reload
        if (el.scrollTop <= 128) {

            // Detach it by safety
            this.detachScrollListener();

            // load all messages
            var messages = ChatStore.getMessages(this.state.chatroom);

            // Request
            if(0 < messages.length) {
                var last = messages[0].createdAt;

                // Save
                this.setState({
                    heigth: el.scrollHeight
                });

                ChatActions.messages(this.state.chatroom, last);
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
        this.forceUpdate();
    },

    _stick: function() {
        var el = this.getDOMNode();
        
        if(true === this.state.stick) {    
            el.scrollTop = el.scrollHeight;
        }
        else if(this.state.heigth !== el.scrollHeight)
        {
            // Fix the scroll
            el.scrollTop = el.scrollHeight - this.state.heigth;
            
            // Save the value
            this.setState({
                heigth: el.scrollHeight
            });
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
