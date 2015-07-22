'use strict';

// Include React as npm package
global.React = require('react');

// Request the configuration file to setup the application
var config = require('application/config');

// Include requirements
var Router  = require('application/router.js');
var TeamApp = require('templates/application/team-app.jsx');

var MiitApp = {
    COPYRIGHT: config.COPYRIGHT,
    VERSION:   config.VERSION,
    init: function() {
        // Initialize the router
        Router.init();

        // Render the TeamApp component
        React.render(<TeamApp />, document.getElementById('content'));
    },
    shared: config.shared
};

global.MiitApp = MiitApp;