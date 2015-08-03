
// Define the quiz plugin
var plugin = {
    identifier: 'APP_QUIZ',

    onRegister: function() {
        require('quiz-actions');
        require('quiz-store');
        require('templates/quiz-page.jsx');
    },

    onRemove: function() {

    }
};

// Register the quiz plugin
ApplicationLoader.register(plugin);