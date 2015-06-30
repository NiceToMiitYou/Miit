(function(){
    var UserActions = injector.resolve(
        ['miit-dispatcher', 'miit-realtime', 'miit-user-constants', 'miit-user-store'],
        function(MiitDispatcher, MiitRealtime, MiitUserConstants, UserStore) {
            var ActionTypes   = MiitUserConstants.ActionTypes;

            // Handle login from token
            MiitRealtime.on('login:token', function(data) {
                if(data.user) {
                    var action = {
                        type:  ActionTypes.REFRESH_USER_COMPLETED,
                        token: data.token,
                        user:  data.user
                    };

                    MiitDispatcher.dispatch(action);
                }
            });

            // Handle login
            MiitRealtime.on('login:password', function(data) {
                var action = {
                    type: (data.done) ? ActionTypes.LOGIN_USER_COMPLETED :
                                        ActionTypes.LOGIN_USER_ERROR,
                    user:  data.user,
                    token: data.token
                };

                MiitDispatcher.dispatch(action);
            });

            // Handle password change
            MiitRealtime.on('user:password', function(data) {
                var action = {
                    type: (data.done) ? ActionTypes.CHANGE_PASSWORD_USER_COMPLETED :
                                        ActionTypes.CHANGE_PASSWORD_USER_ERROR
                };

                MiitDispatcher.dispatch(action);
            });

            // Handle update
            MiitRealtime.on('user:update', function(data) {
                var action = {
                    type: (data.done) ? ActionTypes.UPDATE_USER_COMPLETED :
                                        ActionTypes.UPDATE_USER_ERROR,
                    name: data.name
                };

                MiitDispatcher.dispatch(action);
            });

            function check() {
                var token = UserStore.getToken();

                if(token) {
                    // Request the server
                    MiitRealtime.send('login:token', {
                        token: token
                    });
                }
            }

            MiitRealtime.on('open', function() {
                // Connection the user
                check();
            });

            MiitRealtime.on('reconnected', function() {
                // Reconnect the user
                check();
            });

            return {
                login: function(email, password) {
                    // Request the server
                    MiitRealtime.send('login:password', {
                        email:    email,
                        password: password
                    });
                },

                logout: function() {
                    var action = {
                        type:  ActionTypes.LOGOUT_USER_COMPLETED
                    };

                    MiitDispatcher.dispatch(action);
                },

                check: check,

                changePassword: function(password_old, password_new) {
                    // Request the server
                    MiitRealtime.send('user:password', {
                        'old': password_old,
                        'new': password_new
                    });
                },

                update: function(name) {
                    // Request the server
                    MiitRealtime.send('user:update', {
                        name: name
                    });
                }
            };
        }
    );

    injector.register('miit-user-actions', UserActions);
})();