'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    ActionTypes = require('core/constants/user-status-constants').ActionTypes,
    TeamStore   = require('core/stores/team-store');

// List of events
var events = KeyMirror({
    // Events on chat event
    STATUS_CHANGED: null
});

// Global variables
var UserStatus = [];


function _changeStatus(status) {
    // Remove the status if offline
    if(status.status === 'OFFLINE') {
        UserStatus.removeBy('userId', status.userId);
        return;
    }

    // Find
    var item = UserStatus.findBy('userId', status.userId);

    if(item) {
        item.status = status.status;
        return;
    }

    // if not in, add it
    UserStatus.push(status);
}

function _getStatusOf(userId) {
    var item = UserStatus.findBy('userId', userId);

    if(item) {
        return item.status || 'OFFLINE';
    }

    return 'OFFLINE';
}

function _replaceStatus(status) {
    UserStatus = status || [];
    UserStatus.removeBy('status', 'OFFLINE');
}

// The UserStatusStore Object
var UserStatusStore = ObjectAssign({}, EventEmitter.prototype, {
    getUsers: function(filtered) {
        if(true === filtered) {
            return TeamStore.getUsers();
        }

        var users = [];

        users.mergeBy('id',
            UserStatus.map(function(status) {
                return TeamStore.getUser(status.userId);
            })
        );
        users.mergeBy('id', TeamStore.getUsers());

        return users;
    },

    getUserStatus: function() {
        return UserStatus;
    },

    getUserStatusByUserId: function(userId) {
        return _getStatusOf(userId);
    }
});

// Register Functions based on event
UserStatusStore.generateNamedFunctions(events.STATUS_CHANGED);

// Handle actions
UserStatusStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.REFRESH_USER_STATUS:
            
            // Replace all status
            _replaceStatus(action.status);

            // Emit the status changed event
            UserStatusStore.emitStatusChanged(); 
            break;

        case ActionTypes.UPDATE_USER_STATUS:
            
            // Change the status
            _changeStatus(action.status);

            // Emit the status changed event
            UserStatusStore.emitStatusChanged(); 
            break;
    }
});

module.exports = UserStatusStore;
