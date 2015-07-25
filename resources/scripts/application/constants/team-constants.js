'use strict';

var TeamConstants = {
    ActionTypes: KeyMirror({
        // Handle user action
        UPDATE_USER_COMPLETED: null,
        REFRESH_USERS_COMPLETED: null,
        // Update Actions
        UPDATE_TEAM_COMPLETED: null,
        // Invite Actions
        INVITE_USER_COMPLETED: null,
        // Demote Actions
        DEMOTE_USER_COMPLETED: null,
        // Promote Actions
        PROMOTE_USER_COMPLETED: null,
        // Remove Actions
        REMOVE_USER_COMPLETED: null
    })
};

module.exports = TeamConstants;