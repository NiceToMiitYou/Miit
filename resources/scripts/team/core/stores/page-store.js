'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    ActionTypes = require('core/constants/page-constants').ActionTypes,
    UserStore   = require('core/stores/user-store'),
    TeamStore   = require('core/stores/team-store');

// List of events
var events = KeyMirror({
    // Events on page Change
    PAGE_CHANGED: null,
    MENU_TOGGLED: null
});

// Load all pages
var config = require('pages/_config');

// The default page
var defaultPage  = config['default'];
var notFoundPage = config['404'];

// All needed pages variables
var CurrentMainPage, CurrentApplicationPage, Argument;

// Menu State
var MenuOpened = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) >= 768;

// A storage for all pages
var PageStorage = new DataStore('pages'),
    PageAllowed = new DataStore('allowed');

// The PageStore Object
var PageStore = ObjectAssign({}, EventEmitter.prototype, {
    getCurrentMainPageIdentifier: function() {
        return CurrentMainPage;
    },

    getCurrentApplicationPageIdentifier: function() {
        return CurrentApplicationPage;
    },
    
    getCurrentMainPage: function() {
        var page    = CurrentMainPage,
            allowed = PageAllowed.get('main-' + page);

        if(
            false === TeamStore.isPublic()   && 
            false === UserStore.isLoggedIn() &&
            false === allowed
        ) {
            page = 'login';
        }
        else if(
            true === UserStore.isLoggedIn() && 'login' === page
        ) {
            page = defaultPage;
        }

        return PageStorage.get('main-' + page);
    },

    getCurrentApplicationPage: function() {
        return PageStorage.get('app-' + CurrentMainPage + '-' + CurrentApplicationPage);
    },

    getArgument: function() {
        return Argument;
    },

    getMenuState: function() {
        return MenuOpened;
    },

    getDefaultPage: function() {
        return PageStorage.get('main-' + defaultPage);
    },

    getNotFoundPage: function() {
        return PageStorage.get('main-' + notFoundPage);
    },

    registerMainPage: function(name, component, allowed) {
        var key = 'main-' + name;

        PageStorage.set(key, component);
        PageAllowed.set(key, !!allowed);

        // Emit the change
        PageStore.emitPageChanged();
    },

    registerApplicationPage: function(main, name, component) {
        var key = 'app-' + main +  '-' + name;

        PageStorage.set(key, component);

        // Emit the change
        PageStore.emitPageChanged();
    },

    removeMainPage: function(name) {
        var key = 'main-' + name;

        PageStorage.remove(key);
        PageAllowed.remove(key);

        // Emit the change
        PageStore.emitPageChanged();
    },

    removeApplicationPage: function(main, name) {
        var key = 'app-' + main +  '-' + name;

        PageStorage.remove(key);
        
        // Emit the change
        PageStore.emitPageChanged();
    }
});

// Register Functions based on event
PageStore.generateNamedFunctions(events.PAGE_CHANGED);
PageStore.generateNamedFunctions(events.MENU_TOGGLED);

// Handle actions
PageStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.CHANGE_PAGE:
            CurrentMainPage        = action.main;
            CurrentApplicationPage = action.app;
            Argument               = action.argument;

            PageStore.emitPageChanged();
            break;

        case ActionTypes.TOGGLE_MENU:

            // Toggle the menu
            MenuOpened = !MenuOpened;

            PageStore.emitMenuToggled(MenuOpened);
            break;
    }
});

module.exports = PageStore;