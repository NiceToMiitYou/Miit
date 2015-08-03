'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    ActionTypes = require('core/constants/user-constants').ActionTypes;

// List of events
var events = KeyMirror({
    // Event on login
    LOGGED_IN: null,
    LOGIN_ERROR: null,
    // Event on password change
    PASSWORD_CHANGED: null,
    PASSWORD_NOT_CHANGED: null,
    // Event on update
    USER_UPDATED: null
});

// Global variables
var Me, Utils, Token, AnonymToken, LoggedIn = false;

// Generate the validator for user's role
function _isUserGenerator(role) {
    return function(user) {
        var roles = (user || Me || {}).roles || ['ANONYM'];

        return -1 !== roles.indexOf(role);
    };
}

function _isAnonymous(user) {
    return _isUserGenerator('ANONYM')(user);
}

// Check if this is the same user
function _isItMe(user) {
    var me  = (Me || {}).id || null;
    var you = (user || {}).id || null;

    return me === you;
}

function _getName(user) {
    // Get user or me
    user = user || Me || {};
    // Check if anonym
    if(_isAnonymous(user)) {
        return 'Anonyme';
    }
    return user.name;
}

function _update(name) {
    Me.name = name;
}

function _connect(token, user) {
    Me       = user;
    Token    = token;
    LoggedIn = true;

    // Save in the local storage
    localStorage.setItem('token', Token);
}

function _connectAnonym(token, user) {
    Me          = user;
    AnonymToken = token;

    // Save in the local storage
    localStorage.setItem('anonym_token', AnonymToken);
}

function _disconnect() {
    Me       = null;
    Token    = null;
    LoggedIn = false;

    // Erase from local storage
    localStorage.removeItem('token');
}

var UserStore = ObjectAssign({}, EventEmitter.prototype, {
    isLoggedIn: function() {
        return LoggedIn;
    },

    getUser: function() {
        if(!Me) {
            Me = MiitApp.shared.get('user');
        }
        return Me;
    },

    getAnonymToken: function() {
        if(!AnonymToken) {
            AnonymToken = localStorage.getItem('anonym_token');
        }
        return AnonymToken;
    },

    getToken: function() {
        if(!Token) {
            Token = localStorage.getItem('token');
        }
        return Token;
    },
    
    isOwner:  _isUserGenerator('OWNER'),

    isAdmin:  _isUserGenerator('ADMIN'),

    isUser:   _isUserGenerator('USER'),
    
    isAnonym: _isAnonymous,
    
    isItMe:   _isItMe,

    getName:  _getName
});

UserStore.generateNamedFunctions(events.LOGGED_IN);
UserStore.generateNamedFunctions(events.LOGIN_ERROR);

UserStore.generateNamedFunctions(events.PASSWORD_CHANGED);
UserStore.generateNamedFunctions(events.PASSWORD_NOT_CHANGED);

UserStore.generateNamedFunctions(events.USER_UPDATED);

UserStore.dispatchToken = Dispatcher.register(function(action){

    switch(action.type) {
        case ActionTypes.REFRESH_USER:
            _connect(action.token, action.user);
            UserStore.emitLoggedIn();
            break;

        case ActionTypes.LOGIN_ANONYM:
            _connectAnonym(action.token, action.user);
            UserStore.emitLoggedIn();
            break;

        case ActionTypes.LOGIN_USER:
            _connect(action.token, action.user);
            UserStore.emitLoggedIn();
            break;
        case ActionTypes.LOGIN_USER_ERROR:
            UserStore.emitLoginError();
            break;

        case ActionTypes.LOGOUT_USER:
            _disconnect();
            window.location.href = '/';
            break;

        case ActionTypes.CHANGE_PASSWORD_USER:
            UserStore.emitPasswordChanged();
            break;
        case ActionTypes.CHANGE_PASSWORD_USER_ERROR:
            UserStore.emitPasswordNotChanged();
            break;

        case ActionTypes.UPDATE_USER:
            _update(action.name);
            UserStore.emitUserUpdated();
            break;
    }
});

module.exports = UserStore;