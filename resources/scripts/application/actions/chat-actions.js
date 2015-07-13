
// Include requirements
var Dispatcher    = require('../dispatcher'),
    Realtime      = require('../realtime'),
    ChatConstants = require('../constants/chat-constants');

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
    send: function(chatroom, text) {
        Realtime.send('chat:send', {
            chatroom: chatroom,
            text:     text
        });
    }
};