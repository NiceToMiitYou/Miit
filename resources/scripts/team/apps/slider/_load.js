
// Define the quiz plugin
var plugin = {
    identifier: 'APP_SLIDER',

    onRegister: function() {
        // Preload the page
        require('templates/_load');

        // Load the store and actions
        var actions = require('slider-actions'),
            store   = require('slider-store');
        
        actions.refresh();
    },

    onRemove: function() {

    }
};

// Register the quiz plugin
ApplicationLoader.register(plugin);