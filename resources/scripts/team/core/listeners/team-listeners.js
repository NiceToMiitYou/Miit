'use strict';

var ApplicationLoader = require('core/lib/application-loader'),
    TeamStore         = require('core/stores/team-store');

var loaded = [];

function refreshApplicationsScripts() {
    var applications = TeamStore.getTeam().applications || [];

    applications.forEach(function(application) {
        ApplicationLoader.add(application.identifier);
    });
}

// Handle team update
TeamStore.addTeamUpdatedListener(refreshApplicationsScripts);

// Start it once
MiitApp.onInit(refreshApplicationsScripts);