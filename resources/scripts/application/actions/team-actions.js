'use strict';

// Include requirements
var Dispatcher    = require('application/dispatcher'),
    Realtime      = require('application/realtime'),
    TeamConstants = require('application/constants/team-constants');

// Shortcut
var ActionTypes = TeamConstants.ActionTypes;

//
// Listen for events
//

// Handle promote
Realtime.on('team:promote', function(data) {
    var action = {
        type: (data.done) ? ActionTypes.PROMOTE_USER_COMPLETED :
                            ActionTypes.PROMOTE_USER_ERROR,
        id:    data.id,
        roles: data.roles
    };

    Dispatcher.dispatch(action);
});

// Handle demote
Realtime.on('team:demote', function(data) {
    var action = {
        type: (data.done) ? ActionTypes.DEMOTE_USER_COMPLETED :
                            ActionTypes.DEMOTE_USER_ERROR,
        id:    data.id,
        roles: data.roles
    };

    Dispatcher.dispatch(action);
});

// Handle remove
Realtime.on('team:remove', function(data) {
    var action = {
        type: (data.done) ? ActionTypes.REMOVE_USER_COMPLETED :
                            ActionTypes.REMOVE_USER_ERROR,
        id: data.id
    };

    Dispatcher.dispatch(action);
});

// Handle invite
Realtime.on('team:invite', function(data) {
    var action = {
        type: (data.done) ? ActionTypes.INVITE_USER_COMPLETED :
                            ActionTypes.INVITE_USER_ERROR,
        user: data.user
    };

    Dispatcher.dispatch(action);
});

// Handle update
Realtime.on('team:update', function(data) {
    var action = {
        type: (data.done) ? ActionTypes.UPDATE_TEAM_COMPLETED :
                            ActionTypes.UPDATE_TEAM_ERROR,
        name:   data.name,
        public: data.public
    };

    Dispatcher.dispatch(action);
});

// Handle user update
Realtime.on('team:user:update', function(data) {
    var action = {
        type: ActionTypes.UPDATE_USER_COMPLETED,
        id:   data.id,
        name: data.name
    };

    Dispatcher.dispatch(action);
});

// Handle refresh
Realtime.on('team:users', function(data) {
    var action = {
        type:  ActionTypes.REFRESH_USERS_COMPLETED,
        users: data.users
    };

    Dispatcher.dispatch(action);
});

module.exports = {
    refresh: function() {
        Realtime.send('team:users');
    },

    update: function(name, publix) {
        Realtime.send('team:update', {
            name:   name,
            public: publix
        });
    },

    invite: function(email) {
        Realtime.send('team:invite', {
            email: email
        });
    },

    promote: function(id, roles) {
        Realtime.send('team:promote', {
            id:    id,
            roles: roles
        });
    },

    demote: function(id, roles) {
        Realtime.send('team:demote', {
            id:    id,
            roles: roles
        });
    },

    remove: function(id) {
        Realtime.send('team:remove', {
            id: id
        });
    }
};