
// Define the wall plugin
var plugin = {
    identifier: 'APP_WALL',

    onRegister: function() {
        require('wall-actions');
        require('wall-store');
        require('templates/wall-page.jsx');
    },

    onRemove: function() {

    }
};

// Register the wall plugin
ApplicationLoader.register(plugin);