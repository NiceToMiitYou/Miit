'use strict';

// Include React as npm package
global.React = require('react');

// Request the configuration file to setup the application
var config = require('core/config');

// Include requirements
var Router  = require('core/lib/router.js');
var TeamApp = require('core/templates/team-app.jsx');

var MiitApp = {
    COPYRIGHT: config.COPYRIGHT,
    VERSION:   config.VERSION,
    shared:    config.shared,
    init: function() {
        // Initialize the router
        Router.init();

        // Render the TeamApp component
        React.render(<TeamApp />, document.getElementById('content'));
    },
    require: require
};

global.MiitApp = MiitApp;