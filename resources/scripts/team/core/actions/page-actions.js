'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    Router      = require('core/lib/router'),
    ActionTypes = require('core/constants/page-constants').ActionTypes;

// Load pages
var config = require('pages/_config');

// Expose the actions
var PageActions = {
    changePage: function(main, app, argument) {
        var action = {
            type:     ActionTypes.CHANGE_PAGE,
            main:     main,
            app:      app,
            argument: argument
        };

        Dispatcher.dispatch(action);
    },

    toggleMenu: function() {
        var action = {
            type:     ActionTypes.TOGGLE_MENU
        };

        Dispatcher.dispatch(action);
    }
};

// Get the router and handle page change
Router.routes.set('/([a-zA-Z0-9_\-]{0,})/?([a-zA-Z0-9_\-]{0,})?/?([a-zA-Z0-9_\-]{0,})?', function(mainPage, appPage, argument) {
    var page = mainPage || config.default;

    // Set the current active page of the menu
    ActiveGroups['menu-team'] = page;

    // Set the current active page
    PageActions.changePage(page, appPage, argument);
});

module.exports = PageActions;