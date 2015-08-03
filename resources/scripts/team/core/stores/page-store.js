'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    ActionTypes = require('core/constants/page-constants').ActionTypes,
    UserStore   = require('core/stores/user-store'),
    TeamStore   = require('core/stores/team-store');

// List of events
var events = KeyMirror({
    // Events on page Change
    MAIN_PAGE_CHANGED: null,
    APPLICATION_PAGE_CHANGED: null,
});

// Load all pages
var config = require('pages/_config');

// The default page
var defaultPage  = config.default;
var notFoundPage = config['404'];

// All needed pages variables
var CurrentMainPage, CurrentApplicationPage;

// A storage for all pages
var PageStorage = new DataStore('pages');

// The PageStore Object
var PageStore = ObjectAssign({}, EventEmitter.prototype, {
    getCurrentMainPage: function() {
        var page = CurrentMainPage;

        if(
            false === TeamStore.isPublic() && 
            false === UserStore.isLoggedIn()
        ) {
            page = 'login';
        }
        else if(
            true  === UserStore.isLoggedIn() && 'login' === page
        ) {
            page = defaultPage;
        }

        return PageStorage.get('main-' + page);
    },

    getCurrentApplicationPage: function() {
        return PageStorage.get('application-' + CurrentApplicationPage);
    },

    getDefaultPage: function() {
        return PageStorage.get('main-' + defaultPage);
    },

    getNotFoundPage: function() {
        return PageStorage.get('main-' + notFoundPage);
    },

    registerMainPage: function(name, component) {
        PageStorage.set('main-' + name, component);

        // Emit the change
        PageStore.emitMainPageChanged();
    },

    registerApplicationPage: function(name, component) {
        PageStorage.set('application-' + name, component);

        // Emit the change
        PageStore.emitApplicationPageChanged();
    },

    removeMainPage: function(name) {
        PageStorage.remove('main-' + name);

        // Emit the change
        PageStore.emitMainPageChanged();
    },

    removeApplicationPage: function(name) {
        PageStorage.remove('application-' + name);
        
        // Emit the change
        PageStore.emitApplicationPageChanged();
    }
});

// Register Functions based on event
PageStore.generateNamedFunctions(events.MAIN_PAGE_CHANGED);
PageStore.generateNamedFunctions(events.APPLICATION_PAGE_CHANGED);

// On main page change
var handleChangeMainPage = function(action) {
    // On page changed
    if(action.mainPage &&
       action.mainPage !== CurrentMainPage)
    {
        // Set the current main page
        CurrentMainPage = action.mainPage;
        // Emit the change
        PageStore.emitMainPageChanged();
    }
};

// On application page change
var handleChangeApplicationPage = function(action) {
    // On page changed
    if(action.applicationPage && 
       action.applicationPage !== CurrentApplicationPage)
    {
        // Set the current application page
        CurrentApplicationPage = action.applicationPage;
        // Emit the change
        PageStore.emitApplicationPageChanged();
    }

    handleChangeMainPage(action);
};

// Handle actions
PageStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.CHANGE_APPLICATION_PAGE:
            handleChangeApplicationPage(action);
            break;

        case ActionTypes.CHANGE_MAIN_PAGE:
            handleChangeMainPage(action);
            break;
    }
});

module.exports = PageStore;