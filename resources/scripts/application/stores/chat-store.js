'use strict';

// Include requirements
var Dispatcher    = require('../dispatcher'),
    ChatConstants = require('../constants/chat-constants');

// Shortcut
var ActionTypes = ChatConstants.ActionTypes;

// List of events
var events = KeyMirror({
    // Events on chat event
    NEW_MESSAGE: null,
    CHATROOMS_REFRESHED: null
});

// Global variables
var Chatrooms, Messages = {};

function _replaceChatrooms(chatrooms) {
    Chatrooms = chatrooms || [];    
}

function _addMessages(chatroom, messages) {
    // Create an array if not exist
    if(!Messages[chatroom]) {
        Messages[chatroom] = [];
    }

    Messages[chatroom].mergeBy('id', messages);
}

// The ChatStore Object
var ChatStore = ObjectAssign({}, EventEmitter.prototype, {
    getChatrooms: function() {
        return Chatrooms || [];
    },

    getMessages: function(chatroom) {
        return Messages[chatroom] || [];
    }
});

// Register Functions based on event
ChatStore.generateNamedFunctions(events.NEW_MESSAGE);
ChatStore.generateNamedFunctions(events.CHATROOMS_REFRESHED);

// Handle actions
ChatStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.REPLACE_CHATROOMS:
            _replaceChatrooms(action.chatrooms);
            break;

        case ActionTypes.ADD_MESSAGE:
            _addMessages(action.chatroom, action.message);
            break;

        case ActionTypes.ADD_MESSAGES:
            _addMessages(action.chatroom, action.messages);
            break;
    }
});

module.exports = ChatStore;
