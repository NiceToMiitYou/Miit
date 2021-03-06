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
    PAGE_CLOSED: null,
    LEFT_MENU_TOGGLED: null,
    RIGHT_MENU_TOGGLED: null,
    RIGHT_MENU_LOCK_TOGGLED: null
});

// Load all pages
var config = require('pages/_config');

// The default page
var defaultPage  = config['default'];
var welcomePage  = config['welcome'];
var notFoundPage = config['404'];

// All needed pages variables
var CurrentMainPage = defaultPage, CurrentApplicationPage, Argument;

// Retrieve it from local storage
var RightMenuLocked = 'true' === localStorage.getItem('rigth_menu_lock') || false;

// Menu State
var LeftMenuOpened  = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) >= 768,
    RightMenuOpened = RightMenuLocked;

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
            allowed = PageAllowed.get('main-' + page) || false;

        if(
            false === UserStore.isLoggedIn()      &&
            false === allowed                     && 
            (
                false === TeamStore.hasApplications() ||
                false === TeamStore.isPublic()
            )
        ) {
            page = 'login'; LeftMenuOpened = false;
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

    getLeftMenuState: function() {
        return LeftMenuOpened;
    },

    getRightMenuState: function() {
        return RightMenuOpened;
    },

    getRightMenuLockState: function() {
        return RightMenuLocked;
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
PageStore.generateNamedFunctions(events.PAGE_CLOSED);
PageStore.generateNamedFunctions(events.LEFT_MENU_TOGGLED);
PageStore.generateNamedFunctions(events.RIGHT_MENU_TOGGLED);
PageStore.generateNamedFunctions(events.RIGHT_MENU_LOCK_TOGGLED);

// Handle actions
PageStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.CHANGE_PAGE:
            CurrentMainPage        = action.main;
            CurrentApplicationPage = action.app;
            Argument               = action.argument;

            PageStore.emitPageChanged();
            break;

        case ActionTypes.TOGGLE_LEFT_MENU:

            // Toggle the menu
            LeftMenuOpened = !LeftMenuOpened;

            PageStore.emitLeftMenuToggled(LeftMenuOpened);
            break;

        case ActionTypes.TOGGLE_RIGHT_MENU:

            // Toggle the menu
            if(!RightMenuLocked) {
                RightMenuOpened = !RightMenuOpened;
            }

            PageStore.emitRightMenuToggled(RightMenuOpened);
            break;

        case ActionTypes.TOGGLE_RIGHT_MENU_LOCK:

            // Toggle the menu
            RightMenuLocked = !RightMenuLocked;

            // Save it to local storage
            localStorage.setItem('rigth_menu_lock', RightMenuLocked);

            PageStore.emitRightMenuLockToggled(RightMenuLocked);
            break;

        case ActionTypes.CLOSE_PAGE:
            PageStore.emitPageClosed();
            break;
    }
});

module.exports = PageStore;