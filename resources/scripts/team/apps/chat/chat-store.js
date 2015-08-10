'use strict';

// Include core requirements
var Dispatcher = MiitApp.require('core/lib/dispatcher');

// Include requirement
var ChatConstants = require('chat-constants');

// Shortcut
var ActionTypes = ChatConstants.ActionTypes;

// List of events
var events = KeyMirror({
    // Events on chat event
    NEW_MESSAGE: null,
    CHATROOMS_REFRESHED: null
});

// Global variables
var Chatrooms, Messages = {}, Counter = {};

function _refreshChatrooms(chatrooms) {
    Chatrooms = chatrooms || [];    
}

function _addMessages(chatroom, messages) {
    // Create an array if not exist
    if(!Messages[chatroom]) {
        Messages[chatroom] = [];
    }

    Messages[chatroom].mergeBy('id', messages);
}

function _hasChanged(chatroom) {
    // Create an array if not exist
    if(!Counter[chatroom]) {
        Counter[chatroom] = 0;
    }

    if(Counter[chatroom] !== Messages[chatroom].length) {
        Counter[chatroom] = Messages[chatroom].length;

        return true;
    }

    return false;
}

// The ChatStore Object
var ChatStore = ObjectAssign({}, EventEmitter.prototype, {
    getChatroom: function(id) {
        return this.getChatrooms().findBy('id', id);
    },

    getChatrooms: function() {
        return Chatrooms || [];
    },

    getMessages: function(chatroom) {
        var messages = Messages[chatroom] || [];

        return messages.sortBy('createdAt');
    }
});

// Register Functions based on event
ChatStore.generateNamedFunctions(events.NEW_MESSAGE);
ChatStore.generateNamedFunctions(events.CHATROOMS_REFRESHED);

// Handle actions
ChatStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.REFRESH_CHATROOMS:
            _refreshChatrooms(action.chatrooms);
            ChatStore.emitChatroomsRefreshed();
            break;

        case ActionTypes.ADD_MESSAGE:
            _addMessages(action.chatroom, action.message);
            // Check for change
            if(true === _hasChanged(action.chatroom)) {
                ChatStore.emitNewMessage();
            }
            break;

        case ActionTypes.ADD_MESSAGES:
            _addMessages(action.chatroom, action.messages);
            // Check for change
            if(true === _hasChanged(action.chatroom)) {
                ChatStore.emitNewMessage();
            }
            break;
    }
});

module.exports = ChatStore;
