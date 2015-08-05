
// Define the quiz plugin
var plugin = {
    identifier: 'APP_QUIZ',

    onRegister: function() {
        require('quiz-actions');
        require('quiz-store');
        require('templates/_load');
    },

    onRemove: function() {

    }
};

// Register the quiz plugin
ApplicationLoader.register(plugin);