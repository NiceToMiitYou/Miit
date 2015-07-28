'use strict';

var TeamConstants = {
    ActionTypes: KeyMirror({
        // Handle user action
        UPDATE_USER: null,
        REFRESH_USERS: null,
        // Update Actions
        UPDATE_TEAM: null,
        // Applications actions
        ADD_APPLICATION: null,
        UPDATE_APPLICATION: null,
        REMOVE_APPLICATION: null,
        // Users Actions
        INVITE_USER: null,
        DEMOTE_USER: null,
        PROMOTE_USER: null,
        REMOVE_USER: null
    })
};

module.exports = TeamConstants;