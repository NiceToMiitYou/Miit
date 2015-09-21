
// Define the documents plugin
var plugin = {
    identifier: 'APP_DOCUMENTS',

    onRegister: function() {
        // Preload the page
        require('templates/documents-page.jsx');

        // Load the store and actions
        var actions = require('documents-actions'),
            store   = require('documents-store');
        
        actions.refresh();
    },

    onRemove: function() {

    }
};

// Register the documents plugin
ApplicationLoader.register(plugin);