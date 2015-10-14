'use strict';

var Actions = require('./actions');

function SliderApp() {
    // Load all requirements
    require('./models');
    require('./stores');
    require('./workers');

    // register actions
    var actions = new Actions(this);
}

SliderApp.prototype.identifier = function() {
    return 'APP_SLIDER';
};

module.exports = SliderApp;
