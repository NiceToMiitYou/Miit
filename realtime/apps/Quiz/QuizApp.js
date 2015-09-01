'use strict';

var Actions = require('./actions');

function QuizApp() {
    // Load all requirements
    require('./models');
    require('./stores');

    // register actions
    var actions = new Actions(this);
}

QuizApp.prototype.identifier = function() {
    return 'APP_QUIZ';
};

module.exports = QuizApp;
