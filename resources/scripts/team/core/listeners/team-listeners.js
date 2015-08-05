'use strict';

var ApplicationLoader = require('core/lib/application-loader'),
    UserStore         = require('core/stores/user-store'),
    TeamStore         = require('core/stores/team-store');

var Loaded = {};

function checkLoaded() {
    for(var id in Loaded) {
        
        // If an application is not loaded, end the process
        if(false === Loaded[id]) {
            return;
        }
    }

    // Then render the application
    MiitApp.render();
}

function addAndCheck(identifier) {
    Loaded[identifier] = true;

    checkLoaded();
}

function refreshApplicationsScripts(fromLogin) {
    var applications = TeamStore.getTeam().applications || [];

    // Load each application
    applications.forEach(function(application) {
        // Check if the user is allowed to load the application
        if(TeamStore.hasApplication(application.identifier)) {
            var identifier = application.identifier;

            // Set the application has not loaded if not yet defined
            if(typeof Loaded[identifier] === 'undefined') {
                Loaded[identifier] = false;
            }

            // Generate the callback
            var cb = addAndCheck.bind({}, identifier);

            // Load the application
            ApplicationLoader.add(application.identifier, cb);
        }
    });

    if(true === fromLogin) {
        // Default call
        checkLoaded();
    }
}

// Handle team update and user login
TeamStore.addTeamUpdatedListener(refreshApplicationsScripts);
UserStore.addLoggedInListener(refreshApplicationsScripts.bind({}, true));

// Start it once
MiitApp.onInit(refreshApplicationsScripts);