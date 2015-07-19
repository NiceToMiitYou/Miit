'use strict';

// Include requirements
var Dispatcher    = require('application/dispatcher'),
    Realtime      = require('application/realtime'),
    ChatConstants = require('application/constants/chat-constants');

// Shortcut
var ActionTypes = ChatConstants.ActionTypes;

// Is sending
var Requested = {};

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
    if(!data.chatroom) {
        return;
    }

    var action = {
        type:     ActionTypes.ADD_MESSAGE,
        chatroom: data.chatroom,
        message:  data.message
    };

    Dispatcher.dispatch(action);
});

Realtime.on('chat:messages', function(data) {
    if(!data.chatroom) {
        return;
    }

    Requested[data.chatroom] = false;

    var action = {
        type:     ActionTypes.ADD_MESSAGES,
        chatroom: data.chatroom,
        messages: data.messages
    };
    
    Dispatcher.dispatch(action);
});

// Expose the actions
module.exports = {
    create: function(name) {
        if(!name || !name.trim()) {
            return false;
        }

        Realtime.send('chat:create', {
            name: name
        });

        return true;
    },

    delete: function(chatroom) {
        if(!chatroom) {
            return false;
        }

        Realtime.send('chat:delete', {
            chatroom: chatroom
        });

        return true;
    },

    last: function(chatroom, count) {
        if(!chatroom) {
            return;
        }

        Realtime.send('chat:messages:last', {
            chatroom: chatroom,
            count:    count || 20
        });
    },

    rooms: function() {
        Realtime.send('chat:rooms');
    },

    messages: function(chatroom, last, count) {
        if(!chatroom || true === Requested[chatroom]) {
            return;
        }

        Requested[chatroom] = true;

        Realtime.send('chat:messages', {
            chatroom: chatroom,
            count:    count || 20,
            last:     last
        });
    },

    send: function(chatroom, text) {
        if(!chatroom || !text || !text.trim()) {
            return false;
        }

        Realtime.send('chat:send', {
            chatroom: chatroom,
            text:     text.trim()
        });

        return true;
    }
};