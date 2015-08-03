
// Define the documents plugin
var plugin = {
    identifier: 'APP_DOCUMENTS',

    onRegister: function() {
        //require('documents-actions');
        //require('documents-store');
        //require('templates/documents-page.jsx');
    },

    onRemove: function() {

    }
};

// Register the documents plugin
ApplicationLoader.register(plugin);