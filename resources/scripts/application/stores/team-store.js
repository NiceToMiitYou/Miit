'use strict';

// Include requirements
var Dispatcher    = require('application/dispatcher'),
    TeamConstants = require('application/constants/team-constants');

// Shortcut
var ActionTypes = TeamConstants.ActionTypes;

// List of events
var events = KeyMirror({
    // Tean updated
    TEAM_UPDATED: null,
    TEAM_NOT_UPDATED: null,
    // Users refreshed
    REFRESHED: null,
    NOT_REFRESHED: null,
    // User invited
    INVITED: null,
    NOT_INVITED: null,
    // User promote
    PROMOTED: null,
    NOT_PROMOTED: null,
    // User demote
    DEMOTED: null,
    NOT_DEMOTED: null,
    // User removed
    REMOVED: null,
    NOT_REMOVED: null
});

// Global variables
var Users = [], Team;

function _update(name, publix) {
    if(!Team) {
        Team = MiitApp.shared.get('team');
    }
    
    Team.name   = name;
    Team.public = publix;
}

function _addUser(user) {
    Users.addBy('id', user);
}

function _replaceUsers(users) {
    Users = users || [];
}

function _filterbyRoleUser(role, inverse) {
    return Users.filter(function(user) {
        var result = false;

        if(!inverse) {
            result = user.roles.indexOf(role) >= 0;
        }
        else
        {
            result = user.roles.indexOf(role) < 0;
        }

        return result;
    });
}

function _getUserById(id) {
    if(0 === id.indexOf('ANONYM_', 0)) {
        return {
            id:     id,
            avatar: id.replace('ANONYM_', ''),
            roles:  ['ANONYM']
        };
    }

    return Users.findBy('id', id);
}

function _removeUser(id) {
    var index = Users.indexBy('id', id);
    
    if(index >= 0) {
        delete Users[index];
    }
}

function _promoteUser(id, roles) {
    var index = Users.indexBy('id', id);

    if(Users[index] && Array.isArray(Users[index].roles)) {

        Users[index].roles.merge(roles);
    }
}

function _demoteUser(id, roles) {
    var index = Users.indexBy('id', id);

    if(Users[index] && Array.isArray(Users[index].roles)) {

        Users[index].roles.removeAll(roles);
    }
}

function _hasApplication(application) {
    if(!Team) {
        Team = MiitApp.shared.get('team');
    }

    var applications = Team.applications || [];

    return -1 !== applications.indexOf(application);
}

var TeamStore = ObjectAssign({}, EventEmitter.prototype, {
    getTeam: function() {
        if(!Team) {
            Team = MiitApp.shared.get('team');
        }
        return Team || {};
    },

    isPublic: function() {
        return true === this.getTeam().public;
    },

    getUser: function(id) {
        return _getUserById(id);
    },

    getUsers: function() {
        return Users;    
    },

    getUsersByRole: function(role, inverse) {
        return _filterbyRoleUser(role, inverse);
    },

    hasApplication: function(application) {
        return _hasApplication(application);
    }
});

TeamStore.generateNamedFunctions(events.REFRESHED);
TeamStore.generateNamedFunctions(events.NOT_REFRESHED);

TeamStore.generateNamedFunctions(events.TEAM_UPDATED);
TeamStore.generateNamedFunctions(events.TEAM_NOT_UPDATED);

TeamStore.generateNamedFunctions(events.INVITED);
TeamStore.generateNamedFunctions(events.NOT_INVITED);

TeamStore.generateNamedFunctions(events.PROMOTED);
TeamStore.generateNamedFunctions(events.NOT_PROMOTED);

TeamStore.generateNamedFunctions(events.DEMOTED);
TeamStore.generateNamedFunctions(events.NOT_DEMOTED);

TeamStore.generateNamedFunctions(events.REMOVED);
TeamStore.generateNamedFunctions(events.NOT_REMOVED);

TeamStore.dispatchToken = Dispatcher.register(function(action){

    switch(action.type) {
        case ActionTypes.REFRESH_USERS_COMPLETED:
            _replaceUsers(action.users);
            TeamStore.emitRefreshed();
            break;

        case ActionTypes.UPDATE_TEAM_COMPLETED:
            _update(action.name, action.public);
            TeamStore.emitTeamUpdated();
            break;
        case ActionTypes.UPDATE_TEAM_ERROR:
            TeamStore.emitTeamNotUpdated();
            break;

        case ActionTypes.INVITE_USER_COMPLETED:
            _addUser(action.user);
            TeamStore.emitInvited();
            break;
        case ActionTypes.INVITE_USER_ERROR:
            TeamStore.emitNotInvited();
            break;

        case ActionTypes.PROMOTE_USER_COMPLETED:
            _promoteUser(action.id, action.roles);
            TeamStore.emitPromoted();
            break;
        case ActionTypes.PROMOTE_USER_ERROR:
            TeamStore.emitNotPromoted();
            break;

        case ActionTypes.DEMOTE_USER_COMPLETED:
            _demoteUser(action.id, action.roles);
            TeamStore.emitDemoted();
            break;
        case ActionTypes.DEMOTE_USER_ERROR:
            TeamStore.emitNotDemoted();
            break;

        case ActionTypes.REMOVE_USER_COMPLETED:
            _removeUser(action.id);
            TeamStore.emitRemoved();
            break;
        case ActionTypes.REMOVE_USER_ERROR:
            TeamStore.emitNotRemoved();
            break;
    }

});

global.TeamStore = TeamStore

module.exports = TeamStore;
