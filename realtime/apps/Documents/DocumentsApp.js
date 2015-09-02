'use strict';

var Actions = require('./actions');

function DocumentsApp() {
    // Load all requirements
    require('./models');
    require('./stores');

    // register actions
    var actions = new Actions(this);
}

DocumentsApp.prototype.identifier = function() {
    return 'APP_DOCUMENTS';
};

module.exports = DocumentsApp;
