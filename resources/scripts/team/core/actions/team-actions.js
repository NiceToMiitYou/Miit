'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    Realtime    = require('core/lib/realtime'),
    ActionTypes = require('core/constants/team-constants').ActionTypes;

//
// Listen for events
//

// Handle promote
Realtime.on('team:promote', function(data) {
    var action = {
        type:  ActionTypes.PROMOTE_USER,
        id:    data.id,
        roles: data.roles
    };

    Dispatcher.dispatch(action);
});

// Handle demote
Realtime.on('team:demote', function(data) {
    var action = {
        type:  ActionTypes.DEMOTE_USER,
        id:    data.id,
        roles: data.roles
    };

    Dispatcher.dispatch(action);
});

// Handle remove
Realtime.on('team:remove', function(data) {
    var action = {
        type: ActionTypes.REMOVE_USER,
        id:   data.id
    };

    Dispatcher.dispatch(action);
});

// Handle invite
Realtime.on('team:invite', function(data) {
    var action = {
        type: ActionTypes.INVITE_USER,
        user: data.user
    };

    Dispatcher.dispatch(action);
});

// Handle update
Realtime.on('team:update', function(data) {
    var action = {
        type:   ActionTypes.UPDATE_TEAM,
        name:   data.name,
        public: data.public
    };

    Realtime.send('login:rooms');

    Dispatcher.dispatch(action);
});

// Handle add application
Realtime.on('team:application:add', function(data) {
    var action = {
        type:       ActionTypes.ADD_APPLICATION,
        identifier: data.identifier,
        public:     data.public
    };

    Realtime.send('login:rooms');

    Dispatcher.dispatch(action);
});

// Handle update application
Realtime.on('team:application:update', function(data) {
    var action = {
        type:       ActionTypes.UPDATE_APPLICATION,
        identifier: data.identifier,
        public:     data.public
    };

    Realtime.send('login:rooms');

    Dispatcher.dispatch(action);
});

// Handle add application
Realtime.on('team:application:remove', function(data) {
    var action = {
        type:       ActionTypes.REMOVE_APPLICATION,
        identifier: data.identifier
    };

    Realtime.send('login:rooms');

    Dispatcher.dispatch(action);
});

// Handle user update
Realtime.on('team:user:update', function(data) {
    var action = {
        type: ActionTypes.UPDATE_USER,
        id:   data.id,
        name: data.name
    };

    Dispatcher.dispatch(action);
});

// Handle refresh
Realtime.on('team:users', function(data) {
    var action = {
        type:  ActionTypes.REFRESH_USERS,
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

    addApplication: function(identifier, publix) {
        Realtime.send('team:application:add', {
            identifier: identifier,
            public:     publix
        });
    },

    updateApplication: function(identifier, publix) {
        Realtime.send('team:application:update', {
            identifier: identifier,
            public:     publix
        });
    },

    removeApplication: function(identifier) {
        Realtime.send('team:application:remove', {
            identifier: identifier
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