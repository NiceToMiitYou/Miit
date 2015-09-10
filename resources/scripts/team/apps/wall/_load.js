
// Define the wall plugin
var plugin = {
    identifier: 'APP_WALL',

    onRegister: function() {
        // Preload the page
        require('templates/wall-page.jsx');

        // Load the store and actions
        var actions = require('wall-actions'),
            store   = require('wall-store');
        
        actions.refresh();
    },

    onRemove: function() {

    }
};

// Register the wall plugin
ApplicationLoader.register(plugin);