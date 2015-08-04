'use strict';

// Include core requirements
var Dispatcher = MiitApp.require('core/lib/dispatcher'),
    Realtime   = MiitApp.require('core/lib/realtime'),
    UserStore  = MiitApp.require('core/stores/user-store');

// Include requirements
var ActionTypes = require('chat-constants').ActionTypes;

// Is sending
var Requested = {};

//
// Listen for events
//

Realtime.on('chat:rooms', function(data) {
    var action = {
        type:      ActionTypes.REFRESH_CHATROOMS,
        chatrooms: data.chatrooms
    };

    // Dispatch the action
    Dispatcher.dispatch(action);

    // Send subscription request
    Realtime.send('chat:subscribe');
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
        if(false === UserStore.isAdmin()) {
            return;
        }
        
        if(!name || !name.trim()) {
            return false;
        }

        Realtime.send('chat:create', {
            name: name
        });

        return true;
    },

    delete: function(chatroom) {
        if(false === UserStore.isAdmin()) {
            return;
        }
        
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