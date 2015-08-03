'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    Router      = require('core/lib/router'),
    ActionTypes = require('core/constants/page-constants').ActionTypes;

// Load pages
var config = require('pages/_config');

// Expose the actions
var PageActions = {
    changeMainPage: function(main) {
        var action = {
            type: ActionTypes.CHANGE_MAIN_PAGE,
            mainPage: main
        };

        Dispatcher.dispatch(action);
    },

    changeApplicationPage: function(main, miit, application) {
        var action = {
            type: ActionTypes.CHANGE_APPLICATION_PAGE,
            mainPage: main,
            applicationPage: application
        };

        Dispatcher.dispatch(action);
    }
};

// Get the router and handle page change
Router.routes.set('/([a-zA-Z0-9_\-]{0,})', function(mainPage) {
    var page = mainPage || config.default;

    // Set the current active page of the menu
    ActiveGroups['menu-team'] = page;

    // Set the current active page          
    PageActions.changeMainPage(page);
});

module.exports = PageActions;