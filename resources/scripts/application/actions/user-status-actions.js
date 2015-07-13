
// Include requirements
var Dispatcher          = require('../dispatcher'),
    Realtime            = require('../realtime'),
    UserStatusConstants = require('../constants/user-status-constants');

// Shortcut
var ActionTypes = UserStatusConstants.ActionTypes;

// Global variables
var sending = false;

function onStatusUpdate(data) {
    var action = {
        type:   ActionTypes.UPDATE_USER_STATUS,
        status: data.status
    };

    Dispatcher.dispatch(action);
}

function onStatusRefresh(data) {
    sending = false;

    var action = {
        type:   ActionTypes.REFRESH_USER_STATUS,
        status: data.status
    };

    Dispatcher.dispatch(action);
}

//
// Listen for events
//
Realtime.on('status:user',  onStatusUpdate);
Realtime.on('status:users', onStatusRefresh);

var UserStatusActions = {
    refresh: function() {
        if(false === sending) {
            sending = true;

            Realtime.send('status:users');
        }
    }
};

// Refresh the whole list
UserStatusActions.refresh();

module.exports = UserStatusActions;