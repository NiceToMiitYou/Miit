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

    toggleLeftMenu: function() {
        var action = {
            type: ActionTypes.TOGGLE_LEFT_MENU
        };

        Dispatcher.dispatch(action);
    },

    toggleRightMenu: function() {
        var action = {
            type: ActionTypes.TOGGLE_RIGHT_MENU
        };

        Dispatcher.dispatch(action);
    },

    toggleRightMenuLock: function() {
        var action = {
            type: ActionTypes.TOGGLE_RIGHT_MENU_LOCK
        };

        Dispatcher.dispatch(action);
    },

    closePage: function() {
        var action = {
            type: ActionTypes.CLOSE_PAGE
        };

        Dispatcher.dispatch(action);
    }
};

// Get the router and handle page change
Router.routes.set('/([a-zA-Z0-9_\-]{0,})/?([a-zA-Z0-9_\-]{0,})?/?([a-zA-Z0-9_\-]{0,})?', {

    on: function(mainPage, appPage, argument) {
        var page = mainPage || config['default'];

        // Set the current active page of the menu
        ActiveGroups['menu-team'] = page;

        // Set the current active page
        PageActions.changePage(page, appPage, argument);
    },

    after: function() {
        PageActions.closePage();
    }
});

module.exports = PageActions;