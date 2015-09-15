'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    Realtime    = require('core/lib/realtime'),
    ActionTypes = require('core/constants/user-constants').ActionTypes,
    UserStore   = require('core/stores/user-store');

//
// Listen for events
//

// Handle login from token
Realtime.on('login:token', function(data) {
    if(data.user) {
        var action = {
            type:  ActionTypes.REFRESH_USER,
            token: data.token,
            user:  data.user
        };

        Dispatcher.dispatch(action);
    }
    else if(false === data.done) {
        var action = {
            type: ActionTypes.LOGOUT_USER
        };

        Dispatcher.dispatch(action);
    }
});

// Handle login from token
Realtime.on('login:anonym', function(data) {
    if(data.user) {
        var action = {
            type:  ActionTypes.LOGIN_ANONYM,
            token: data.token,
            user:  data.user
        };

        Dispatcher.dispatch(action);
    }
});

// Handle login
Realtime.on('login:password', function(data) {
    var action = {
        type: (data.done) ? ActionTypes.LOGIN_USER :
                            ActionTypes.LOGIN_USER_ERROR,
        user:  data.user,
        token: data.token
    };

    Dispatcher.dispatch(action);
});

// Handle password change
Realtime.on('user:password', function(data) {
    var action = {
        type: (data.done) ? ActionTypes.CHANGE_PASSWORD_USER :
                            ActionTypes.CHANGE_PASSWORD_USER_ERROR
    };

    Dispatcher.dispatch(action);
});

// Handle update
Realtime.on('user:update', function(data) {
    var action = {
        type: ActionTypes.UPDATE_USER,
        name: data.name
    };

    Dispatcher.dispatch(action);
});

// Handle update
Realtime.on('user:invitation:get', function(data) {
    var action = {
        type:       ActionTypes.RETRIEVE_INVITATION_USER,
        invitation: data.invitation,
        user:       data.user
    };

    Dispatcher.dispatch(action);
});

// Handle update
Realtime.on('user:invitation:register', function(data) {
    var action = {
        type: ActionTypes.ACHIEVED_INVITATION_USER,
        user: data.user
    };

    Dispatcher.dispatch(action);
});

function check() {
    var token       = UserStore.getToken();
    var anonymToken = UserStore.getAnonymToken();

    if(token) {
        // Request the server
        Realtime.send('login:token', {
            token: token
        });
    } else {
        // Request the server
        Realtime.send('login:anonym', {
            token: anonymToken
        });
    }
}

Realtime.on('open', function() {
    // Log in the user
    check();
});

Realtime.on('reconnected', function() {
    // Reconnect the user
    check();
});

module.exports = {
    login: function(email, password) {
        
        Realtime.send('login:password', {
            email:    email,
            password: password
        });
    },

    logout: function() {
        var action = {
            type:  ActionTypes.LOGOUT_USER
        };

        Dispatcher.dispatch(action);
    },

    check: check,

    changePassword: function(password_old, password_new) {
        
        Realtime.send('user:password', {
            'old': password_old,
            'new': password_new
        });
    },

    getInvitation: function(token) {
        if(!token) {
            return false;
        }

        Realtime.send('user:invitation:get', {
            token: token
        });

        return true;
    },

    register: function(token, email, password) {
        if(!token || !email || !password) {
            return false;
        }

        Realtime.send('user:invitation:register', {
            token:    token,
            email:    email,
            password: password
        });

        return true;
    },

    update: function(name) {
        
        Realtime.send('user:update', {
            name: name
        });
    }
};