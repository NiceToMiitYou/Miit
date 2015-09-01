'use strict';

var Actions = require('./actions');

function ChatApp() {
    // Load all requirements
    require('./models');
    require('./stores');

    // register actions
    var actions = new Actions(this);
}

ChatApp.prototype.identifier = function() {
    return 'APP_CHAT';
};

module.exports = ChatApp;
