'use strict';

// Include React as npm package
global.React = require('react/addons');

// Request the configuration file to setup the application
var config = require('core/config');

// Include requirements
var Router  = require('core/lib/router');
var TeamApp = require('core/templates/team-app.jsx');

var isRendered = false;

// Callbacks before init
var callbacks = [];

// Define the application
var MiitApp = {
    COPYRIGHT: config.COPYRIGHT,
    VERSION:   config.VERSION,
    shared:    config.shared,
    onInit: function(callback) {
        // Add an application to the list
        callbacks.push(callback);
    },
    render: function() {
        // Render the TeamApp component
        if(false === isRendered) {
            isRendered = true;

            // Call all callbacks
            callbacks.forEach(function(callback) {
                if(typeof callback === 'function') {
                    callback();
                }
            });

            // Initialize the router
            Router.init();

            React.render(<TeamApp />, document.getElementById('content'));
        }
    },
    require: require('core-require')
};

// Export the App in the page
global.MiitApp = MiitApp;

// Load listeners
require('core/listeners/_load');
