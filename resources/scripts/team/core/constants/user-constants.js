'use strict';

var UserConstants = {
    ActionTypes: KeyMirror({
        // Refresh user from token
        REFRESH_USER: null,
        // Login Actions
        LOGIN_ANONYM: null,
        // Login Actions
        LOGIN_USER: null,
        LOGIN_USER_ERROR: null,
        // Logout Actions
        LOGOUT_USER: null,
        // Change Password Actions
        CHANGE_PASSWORD_USER: null,
        CHANGE_PASSWORD_USER_ERROR: null,
        // Update Actions
        UPDATE_USER: null,
        // Invitation actions
        RETRIEVE_INVITATION_USER: null,
        ACHIEVED_INVITATION_USER: null,
        // Password Actions
        PASSWORD_REQUESTED_USER: null,
        RETRIEVE_PASSWORD_RESET_USER: null,
        ACHIEVED_PASSWORD_RESET_USER: null
    })
};

module.exports = UserConstants;