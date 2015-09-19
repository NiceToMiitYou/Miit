'use strict';

// Include core requirements
var Dispatcher = MiitApp.require('core/lib/dispatcher');

// Include requirement
var ActionTypes = require('chat-constants').ActionTypes;

// List of events
var events = KeyMirror({
    // Events on chat event
    NEW_MESSAGE: null,
    OLD_MESSAGES: null,
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

function _clone(obj) {
    return JSON.parse(
        JSON.stringify(obj)
    );
}

function _formatMessages(messages) {
    var result = [], last = false;

    messages.forEach(function(message) {

        // If there is no message before, store it
        if(!last) {
            // Store last message
            last = _clone(message);
            return;
        }

        // Check date diff
        var diff = new Date(message.createdAt) - new Date(last.createdAt);

        // If different author split messages
        if(
            last.user !== message.user ||
            diff > 120000
        ) {
            result.push(last);

            // Store last message
            last = _clone(message);
            return;
        }

        // If the text is not an array, turn into an array
        if(false === Array.isArray(last.text)) {
            last.text = [
                last.text
            ];
        }

        // If same user, group messages
        last.text.push(message.text);
    });

    if(false !== last) {
        result.push(last);
    }

    return result;
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
    },

    getFormatedMessages: function(chatroom) {
        var messages = this.getMessages(chatroom);

        return _formatMessages(messages);
    }
});

// Register Functions based on event
ChatStore.generateNamedFunctions(events.NEW_MESSAGE);
ChatStore.generateNamedFunctions(events.OLD_MESSAGES);
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

        case ActionTypes.OLD_MESSAGES:
            _addMessages(action.chatroom, action.messages);
            // Check for change
            if(true === _hasChanged(action.chatroom)) {
                ChatStore.emitOldMessages();
            }
            break;
    }
});

module.exports = ChatStore;
