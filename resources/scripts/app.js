
// Include requirements
var Router  = require('application/router.js');
var TeamApp = require('templates/application/team-app.jsx');

// The application
var VERSION   = '0.0.0';
var COPYRIGHT = 'All rights reserved to ITEvents.';

var callbacks = [];
var shared    = new DataStore('shared');

var MiitApp = {
    COPYRIGHT: COPYRIGHT,
    VERSION:   VERSION,
    onInit: function(cb) {
        if(typeof cb === 'function') {
            callbacks.push(cb);
        }
    },
    router: Router,
    init: function() {
        // Start with callbacks
        for(var index in callbacks) {
            callbacks[index]();
        }

        // Initialize the router
        Router.init();

        // Render the TeamApp component
        React.render(<TeamApp />, document.getElementById('content'));
    },
    shared: shared
};

global.MiitApp = MiitApp;