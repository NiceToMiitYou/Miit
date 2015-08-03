'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    ActionTypes = require('core/constants/team-constants').ActionTypes,
    UserStore   = require('core/stores/user-store');

// List of events
var events = KeyMirror({
    // Tean updated
    TEAM_UPDATED: null,
    // Users refreshed
    REFRESHED: null,
    // User invited
    INVITED: null,
    // User promote
    PROMOTED: null,
    // User demote
    DEMOTED: null,
    // User removed
    REMOVED: null
});

// Global variables
var Users = [], Team;

function _update(name, publix) {
    if(!Team) {
        Team = MiitApp.shared.get('team');
    }

    // Kick all anonymous on update of privacity
    if(
        publix !== Team.public &&
        true   === UserStore.isAnonym()
    ) {

        window.location.reload();
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
            result =  0  <= user.roles.indexOf(role);
        }
        else
        {
            result = -1 === user.roles.indexOf(role);
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

function _updateUser(id, name) {
    var index = Users.indexBy('id', id);
    
    if(-1 !== index) {
        Users[index].name = name;
    }
}

function _removeUser(id) {
    var index = Users.indexBy('id', id);
    
    if(-1 !== index) {
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

function _addApplication(identifier, publix) {
    var index = Team.applications.indexBy('identifier', identifier);

    // The application
    var application = {
        identifier: identifier,
        public:     publix
    };

    if(-1 !== index) {
        Team.applications[index] = application;
    }
    else 
    {
        Team.applications.push(application);
    }
}

function _updateApplication(identifier, publix) {
    var index = Team.applications.indexBy('identifier', identifier);

    if(-1 !== index) {
        Team.applications[index].public = publix;
    }
}

function _removeApplication(identifier) {
    Team.applications.removeBy('identifier', identifier);
}

function _hasApplication(application) {
    if(!Team) {
        Team = MiitApp.shared.get('team');
    }

    // The list of applications
    var applications = Team.applications || [];

    // Get the application
    var app = applications.findBy('identifier', application);
    if(!app) {
        return false;
    }

    var isAnonym = UserStore.isAnonym();

    if (
        true === isAnonym && (
            false === app.public || false === Team.public
        )        
    ) {
        return false;
    }

    return true;
}

function _hasApplications() {
    if(!Team) {
        Team = MiitApp.shared.get('team');
    }

    // The list of applications
    var applications = Team.applications || [];

    // Find if he can access to some applications
    return applications.map(function(application) {
        return _hasApplication(application.identifier);
    }).reduce(function(a, b) {
        return a || b;
    }, false);
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

    getUsersByRole:  _filterbyRoleUser,
    hasApplications: _hasApplications,
    hasApplication:  _hasApplication
});

TeamStore.generateNamedFunctions(events.REFRESHED);
TeamStore.generateNamedFunctions(events.TEAM_UPDATED);;

TeamStore.generateNamedFunctions(events.PROMOTED);
TeamStore.generateNamedFunctions(events.DEMOTED);

TeamStore.generateNamedFunctions(events.INVITED);
TeamStore.generateNamedFunctions(events.REMOVED);

TeamStore.dispatchToken = Dispatcher.register(function(action){

    switch(action.type) {
        case ActionTypes.UPDATE_USER:
            _updateUser(action.id, action.name);
            TeamStore.emitRefreshed();
            break;
        case ActionTypes.REFRESH_USERS:
            _replaceUsers(action.users);
            TeamStore.emitRefreshed();
            break;

        case ActionTypes.UPDATE_TEAM:
            _update(action.name, action.public);
            TeamStore.emitTeamUpdated();
            break;

        case ActionTypes.ADD_APPLICATION:
            _addApplication(action.identifier, action.public);
            TeamStore.emitTeamUpdated();
            break;

        case ActionTypes.UPDATE_APPLICATION:
            _updateApplication(action.identifier, action.public);
            TeamStore.emitTeamUpdated();
            break;

        case ActionTypes.REMOVE_APPLICATION:
            _removeApplication(action.identifier);
            TeamStore.emitTeamUpdated();
            break;

        case ActionTypes.INVITE_USER:
            _addUser(action.user);
            TeamStore.emitInvited();
            break;

        case ActionTypes.PROMOTE_USER:
            _promoteUser(action.id, action.roles);
            TeamStore.emitPromoted();
            break;

        case ActionTypes.DEMOTE_USER:
            _demoteUser(action.id, action.roles);
            TeamStore.emitDemoted();
            break;

        case ActionTypes.REMOVE_USER:
            _removeUser(action.id);
            TeamStore.emitRemoved();
            break;
    }
});

module.exports = TeamStore;
