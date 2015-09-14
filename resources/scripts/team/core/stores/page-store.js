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
    LEFT_MENU_TOGGLED: null,
    RIGHT_MENU_TOGGLED: null,
    RIGHT_MENU_LOCK_TOGGLED: null
});

// Load all pages
var config = require('pages/_config');

// The default page
var defaultPage  = config['default'];
var notFoundPage = config['404'];

// All needed pages variables
var CurrentMainPage, CurrentApplicationPage, Argument;

// Menu State
var LeftMenuOpened = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) >= 768;
var RightMenuOpened = false;
var RightMenuLocked = false;

// A storage for all pages
var PageStorage = new DataStore('pages');

// The PageStore Object
var PageStore = ObjectAssign({}, EventEmitter.prototype, {
    getCurrentMainPageIdentifier: function() {
        return CurrentMainPage;
    },

    getCurrentApplicationPageIdentifier: function() {
        return CurrentApplicationPage;
    },
    
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

    registerMainPage: function(name, component) {
        PageStorage.set('main-' + name, component);

        // Emit the change
        PageStore.emitPageChanged();
    },

    registerApplicationPage: function(main, name, component) {
        PageStorage.set('app-' + main +  '-' + name, component);

        // Emit the change
        PageStore.emitPageChanged();
    },

    removeMainPage: function(name) {
        PageStorage.remove('main-' + name);

        // Emit the change
        PageStore.emitPageChanged();
    },

    removeApplicationPage: function(main, name) {
        PageStorage.remove('app-' + main +  '-' +name);
        
        // Emit the change
        PageStore.emitPageChanged();
    }
});

// Register Functions based on event
PageStore.generateNamedFunctions(events.PAGE_CHANGED);
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

            PageStore.emitRightMenuLockToggled(RightMenuLocked);
            break;
    }
});

module.exports = PageStore;