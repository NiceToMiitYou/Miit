
// Define the chat plugin
var plugin = {
    identifier: 'APP_CHAT',

    onRegister: function() {
        // Preload the page
        require('templates/chat-page.jsx');

        // Load the store and actions
        var actions = require('chat-actions'),
            store   = require('chat-store');
        
        actions.rooms();
    },

    onRemove: function() {

    }
};

// Register the chat plugin
ApplicationLoader.register(plugin);