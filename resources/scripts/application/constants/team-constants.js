'use strict';

var TeamConstants = {
    ActionTypes: KeyMirror({
        // Handle user action
        UPDATE_USER: null,
        REFRESH_USERS: null,
        // Update Actions
        UPDATE_TEAM: null,
        // Invite Actions
        INVITE_USER: null,
        // Demote Actions
        DEMOTE_USER: null,
        // Promote Actions
        PROMOTE_USER: null,
        // Remove Actions
        REMOVE_USER: null
    })
};

module.exports = TeamConstants;