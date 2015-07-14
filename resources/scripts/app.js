
// Include React as npm package
global.React = require('react/addons');

// Include requirements
var Router  = require('application/router.js');
var TeamApp = require('templates/application/team-app.jsx');

// The application
var VERSION   = '0.0.0';
var COPYRIGHT = 'All rights reserved to ITEvents.';

var shared    = new DataStore('shared');

var MiitApp = {
    COPYRIGHT: COPYRIGHT,
    VERSION:   VERSION,
    router: Router,
    init: function() {
        // Initialize the router
        Router.init();

        // Render the TeamApp component
        React.render(<TeamApp />, document.getElementById('content'));
    },
    shared: shared
};

global.MiitApp = MiitApp;