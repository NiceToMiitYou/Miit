
// Include requirements
var Dispatcher    = require('../dispatcher'),
    Realtime      = require('../realtime'),
    UserConstants = require('../constants/user-constants'),
    UserStore     = require('../stores/user-store');

// Shortcut
var ActionTypes = UserConstants.ActionTypes;

//
// Listen for events
//

// Handle login from token
Realtime.on('login:token', function(data) {
    if(data.user) {
        var action = {
            type:  ActionTypes.REFRESH_USER_COMPLETED,
            token: data.token,
            user:  data.user
        };

        Dispatcher.dispatch(action);
    }
});

// Handle login from token
Realtime.on('login:anonym', function(data) {
    if(data.user) {
        var action = {
            type:  ActionTypes.LOGIN_ANONYM_COMPLETED,
            token: data.token,
            user:  data.user
        };

        Dispatcher.dispatch(action);
    }
});

// Handle login
Realtime.on('login:password', function(data) {
    var action = {
        type: (data.done) ? ActionTypes.LOGIN_USER_COMPLETED :
                            ActionTypes.LOGIN_USER_ERROR,
        user:  data.user,
        token: data.token
    };

    Dispatcher.dispatch(action);
});

// Handle password change
Realtime.on('user:password', function(data) {
    var action = {
        type: (data.done) ? ActionTypes.CHANGE_PASSWORD_USER_COMPLETED :
                            ActionTypes.CHANGE_PASSWORD_USER_ERROR
    };

    Dispatcher.dispatch(action);
});

// Handle update
Realtime.on('user:update', function(data) {
    var action = {
        type: (data.done) ? ActionTypes.UPDATE_USER_COMPLETED :
                            ActionTypes.UPDATE_USER_ERROR,
        name: data.name
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
    // Connection the user
    check();
});

Realtime.on('reconnected', function() {
    // Reconnect the user
    check();
});

module.exports = {
    login: function(email, password) {
        // Request the server
        Realtime.send('login:password', {
            email:    email,
            password: password
        });
    },

    logout: function() {
        var action = {
            type:  ActionTypes.LOGOUT_USER_COMPLETED
        };

        Dispatcher.dispatch(action);
    },

    check: check,

    changePassword: function(password_old, password_new) {
        // Request the server
        Realtime.send('user:password', {
            'old': password_old,
            'new': password_new
        });
    },

    update: function(name) {
        // Request the server
        Realtime.send('user:update', {
            name: name
        });
    }
};