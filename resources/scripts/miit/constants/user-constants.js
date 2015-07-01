(function(){
    var MiitUserConstants = injector.resolve(
        ['key-mirror'],
        function(KeyMirror) {
            return {
                ActionTypes: KeyMirror({
                    // Refresh user from token
                    REFRESH_USER_COMPLETED: null,
                    // Login Actions
                    LOGIN_ANONYM_COMPLETED: null,
                    // Login Actions
                    LOGIN_USER_COMPLETED: null,
                    LOGIN_USER_ERROR: null,
                    // Logout Actions
                    LOGOUT_USER_COMPLETED: null,
                    // Change Password Actions
                    CHANGE_PASSWORD_USER_COMPLETED: null,
                    CHANGE_PASSWORD_USER_ERROR: null,
                    // Update Actions
                    UPDATE_USER_COMPLETED: null,
                    UPDATE_USER_ERROR: null
                })
            };
        }
    );

    injector.register('miit-user-constants', MiitUserConstants);
})();