'use strict';

var ApplicationLoader = require('core/lib/application-loader'),
    UserStore         = require('core/stores/user-store'),
    TeamStore         = require('core/stores/team-store');

var loaded = [];

function refreshApplicationsScripts() {
    var applications = TeamStore.getTeam().applications || [];

    // Load each application
    applications.forEach(function(application) {
        // Check if the user is allowed to load the application
        if(TeamStore.hasApplication(application.identifier)) {
            // Load the application
            ApplicationLoader.add(application.identifier);
        }
    });
}

// Handle team update and user login
TeamStore.addTeamUpdatedListener(refreshApplicationsScripts);
UserStore.addLoggedInListener(refreshApplicationsScripts);

// Start it once
MiitApp.onInit(refreshApplicationsScripts);