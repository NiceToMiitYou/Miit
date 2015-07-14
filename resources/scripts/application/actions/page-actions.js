
// Include requirements
var Dispatcher    = require('application/dispatcher'),
    PageConstants = require('application/constants/page-constants'),
    Router        = require('application/router');

// Load pages
var pages = require('templates/application/pages/_load');

// Shortcut
var ActionTypes = PageConstants.ActionTypes;

// Expose the actions
var PageActions = {
    changeMainPage: function(main) {
        var action = {
            type: ActionTypes.CHANGE_MAIN_PAGE_COMPLETED,
            mainPage: main
        };

        Dispatcher.dispatch(action);
    },

    changeApplicationPage: function(main, miit, application) {
        var action = {
            type: ActionTypes.CHANGE_APPLICATION_PAGE_COMPLETED,
            mainPage: main,
            applicationPage: application
        };

        Dispatcher.dispatch(action);
    }
};

// Get the router and handle page change
Router.routes.set('/([a-zA-Z0-9_\-]{0,})', function(mainPage) {
    var page = mainPage || pages.default;

    // Set the current active page of the menu
    ActiveGroups['menu-team'] = page;

    // Set the current active page          
    PageActions.changeMainPage(page);
});

module.exports = PageActions;