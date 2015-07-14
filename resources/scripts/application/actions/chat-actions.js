
// Include requirements
var Dispatcher    = require('application/dispatcher'),
    Realtime      = require('application/realtime'),
    ChatConstants = require('application/constants/chat-constants');

// Shortcut
var ActionTypes = ChatConstants.ActionTypes;

//
// Listen for events
//
Realtime.on('chat:rooms', function(data) {
    var action = {
        type:      ActionTypes.REPLACE_CHATROOMS,
        chatrooms: data.chatrooms
    };

    Dispatcher.dispatch(action);
});

Realtime.on('chat:message', function(data) {
    var action = {
        type:     ActionTypes.ADD_MESSAGE,
        chatroom: data.chatroom,
        message:  data.message
    };

    Dispatcher.dispatch(action);
});

Realtime.on('chat:messages', function(data) {
    var action = {
        type:     ActionTypes.ADD_MESSAGES,
        chatroom: data.chatroom,
        messages: data.messages
    };
    
    Dispatcher.dispatch(action);
});

// Expose the actions
module.exports = {
    refresh: function() {
        Realtime.send('chat:rooms');
    },

    send: function(chatroom, text) {
        Realtime.send('chat:send', {
            chatroom: chatroom,
            text:     text
        });
    }
};