'use strict';

var ApplicationLoader  = require('core/lib/application-loader'),
    UserStore          = require('core/stores/user-store'),
    TeamStore          = require('core/stores/team-store'),
    TeamActions        = require('core/actions/team-actions'),
    PageStore          = require('core/stores/page-store'),
    PageActions        = require('core/actions/page-actions'),
    UserStatusActions  = require('core/actions/user-status-actions'),
    SubscriptionsStore = require('core/stores/subscriptions-store');

var Loaded = {};

function checkLoaded() {
    for(var id in Loaded) {
        
        // If an application is not loaded, end the process
        if(false === Loaded[id]) {
            return;
        }
    }

    // Then render the application
    setTimeout(function() {
        MiitApp.render();
    });
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

function refreshUsers() {
    if(
        false === UserStore.isAnonym() ||
        true  === TeamStore.isPublic()
    ) {
        TeamActions.refresh();
        UserStatusActions.refresh();
    }
}

function updateTitle() {
    // get team and update title of the document
    var team   = TeamStore.getTeam(),
        unread = SubscriptionsStore.getUnread(),
        prefix = '';

    if(0 < unread) {
        prefix = '(' + unread + ') ';
    }

    document.title = prefix + team.name + ' - Miit';
}

function openMenuOnLogin() {
    setTimeout(function() {
        if(
            true  === PageStore.getLeftMenuState() &&
            false === UserStore.isLoggedIn()       &&
            (
                false === TeamStore.hasApplications() ||
                false === TeamStore.isPublic()
            )
        ) {
            PageActions.toggleLeftMenu();
        }

        else if(
            false === PageStore.getLeftMenuState() &&
            true  === UserStore.isLoggedIn()
        ) {
            PageActions.toggleLeftMenu();
        }
    });
}

// Change page title on update
TeamStore.addTeamUpdatedListener(updateTitle);
SubscriptionsStore.addSubscriptionsUpdatedListener(updateTitle);

// Handle team update and user login
TeamStore.addTeamUpdatedListener(refreshApplicationsScripts);
UserStore.addLoggedInListener(refreshApplicationsScripts.bind({}, true));

// Handle page refresh on login
UserStore.addLoggedInListener(refreshUsers);
UserStore.addLoggedInListener(openMenuOnLogin);

// Start it once
MiitApp.onInit(refreshUsers);
MiitApp.onInit(refreshApplicationsScripts);
MiitApp.onInit(openMenuOnLogin);