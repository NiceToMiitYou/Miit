'use strict';

var TeamConstants = {
    ActionTypes: KeyMirror({
        REFRESH_USERS_COMPLETED: null,
        // Update Actions
        UPDATE_TEAM_COMPLETED: null,
        UPDATE_TEAM_ERROR: null,
        // Invite Actions
        INVITE_USER_COMPLETED: null,
        INVITE_USER_ERROR: null,
        // Demote Actions
        DEMOTE_USER_COMPLETED: null,
        DEMOTE_USER_ERROR: null,
        // Promote Actions
        PROMOTE_USER_COMPLETED: null,
        PROMOTE_USER_ERROR: null,
        // Remove Actions
        REMOVE_USER_COMPLETED: null,
        REMOVE_USER_ERROR: null
    })
};

module.exports = TeamConstants;