'use strict';

// Include React as npm package
global.React = require('react');

// Request the configuration file to setup the application
var config = require('core/config');

// Include requirements
var Router  = require('core/lib/router');
var TeamApp = require('core/templates/team-app.jsx');

var self = this;

// Define the application
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
    require: require('core-require')
};

// Export the App in the page
global.MiitApp = MiitApp;

// Load listeners
require('core/listeners/_load');
