
// Define the chat plugin
var plugin = {
    identifier: 'APP_CHAT',

    onRegister: function() {
        require('chat-actions');
        require('chat-store');
        require('templates/chat-page.jsx');
    },

    onRemove: function() {

    }
};

// Register the chat plugin
ApplicationLoader.register(plugin);