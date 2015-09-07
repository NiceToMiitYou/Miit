'use strict';

var Actions = require('./actions');

function WallApp() {
    // Load all requirements
    require('./models');
    require('./stores');

    // register actions
    var actions = new Actions(this);
}

WallApp.prototype.identifier = function() {
    return 'APP_WALL';
};

module.exports = WallApp;
