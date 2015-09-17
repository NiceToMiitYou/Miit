'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    Realtime    = require('core/lib/realtime'),
    ActionTypes = require('core/constants/user-status-constants').ActionTypes;

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

module.exports = {
    refresh: function() {
        if(false === sending) {
            sending = true;

            Realtime.send('status:users');
        }
    }
};