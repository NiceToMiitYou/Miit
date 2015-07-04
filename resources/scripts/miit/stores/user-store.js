(function(){
    var Me, Utils, Token, AnonymToken, LoggedIn = false;

    // Generate the validator for user's role
    function _isUserGenerator(role) {
        return function(user) {
            var roles = (user || Me || {}).roles || [];

            return roles.indexOf(role) >= 0;
        };
    }

    function _isAnonymous(user) {
        return _isUserGenerator('ANONYM')(user);
    }

    // Check if this is the same user
    function _isItMe(user) {
        var me  = (Me || {}).id || null;
        var you = (user || {}).id || null;

        return me === you;
    }

    function _getName(user) {
        // Get user or me
        user = user || Me || {};
        // Check if anonym
        if(_isAnonymous(user)) {
            return 'Anonyme';
        }
        return user.name;
    }

    function _update(name) {
        Me.name = name;
    }

    function _connect(token, user) {
        Me       = user;
        Token    = token;
        LoggedIn = true;

        // Save in the local storage
        localStorage.setItem('token', Token);
    }

    function _connectAnonym(token, user) {
        Me          = user;
        AnonymToken = token;

        // Save in the local storage
        localStorage.setItem('anonym_token', AnonymToken);
    }

    function _disconnect() {
        Me       = null;
        Token    = null;
        LoggedIn = false;

        // Erase from local storage
        localStorage.removeItem('token');
    }

    var MiitUserStore = injector.resolve(
        ['object-assign', 'key-mirror', 'miit-storage', 'miit-dispatcher', 'miit-user-constants'],
        function(ObjectAssign, KeyMirror, MiitStorage, MiitDispatcher, MiitUserConstants) {
            var ActionTypes = MiitUserConstants.ActionTypes;

            var events = KeyMirror({
                // Event on login
                LOGGED_IN: null,
                LOGIN_ERROR: null,
                // Event on password change
                PASSWORD_CHANGED: null,
                PASSWORD_NOT_CHANGED: null,
                // Event on update
                USER_UPDATED: null,
                USER_NOT_UPDATED: null,
            });

            var UserStore = ObjectAssign({}, EventEmitter.prototype, {
                isLoggedIn: function() {
                    return LoggedIn;
                },

                getUser: function() {
                    if(!Me) {
                        Me = MiitStorage.get('user');
                    }
                    return Me;
                },

                getAnonymToken: function() {
                    if(!AnonymToken) {
                        AnonymToken = localStorage.getItem('anonym_token');
                    }
                    return AnonymToken;
                },

                getToken: function() {
                    if(!Token) {
                        Token = localStorage.getItem('token');
                    }
                    return Token;
                },
                
                isOwner:  _isUserGenerator('OWNER'),

                isAdmin:  _isUserGenerator('ADMIN'),

                isUser:   _isUserGenerator('USER'),
                
                isAnonym: _isAnonymous,
                
                isItMe:   _isItMe,

                getName:  _getName
            });

            UserStore.generateNamedFunctions(events.LOGGED_IN);
            UserStore.generateNamedFunctions(events.LOGIN_ERROR);

            UserStore.generateNamedFunctions(events.PASSWORD_CHANGED);
            UserStore.generateNamedFunctions(events.PASSWORD_NOT_CHANGED);

            UserStore.generateNamedFunctions(events.USER_UPDATED);
            UserStore.generateNamedFunctions(events.USER_NOT_UPDATED);

            UserStore.dispatchToken = MiitDispatcher.register(function(action){

                switch(action.type) {
                    case ActionTypes.REFRESH_USER_COMPLETED:
                        _connect(action.token, action.user);
                        UserStore.emitLoggedIn();
                        break;

                    case ActionTypes.LOGIN_ANONYM_COMPLETED:
                        _connectAnonym(action.token, action.user);
                        UserStore.emitLoggedIn();
                        break;

                    case ActionTypes.LOGIN_USER_COMPLETED:
                        _connect(action.token, action.user);
                        UserStore.emitLoggedIn();
                        break;
                    case ActionTypes.LOGIN_USER_ERROR:
                        UserStore.emitLoginError();
                        break;

                    case ActionTypes.LOGOUT_USER_COMPLETED:
                        _disconnect();
                        window.location.href = '/';
                        break;

                    case ActionTypes.CHANGE_PASSWORD_USER_COMPLETED:
                        UserStore.emitPasswordChanged();
                        break;
                    case ActionTypes.CHANGE_PASSWORD_USER_ERROR:
                        UserStore.emitPasswordNotChanged();
                        break;

                    case ActionTypes.UPDATE_USER_COMPLETED:
                        _update(action.name);
                        UserStore.emitUserUpdated();
                        break;
                    case ActionTypes.UPDATE_USER_ERROR:
                        UserStore.emitUserNotUpdated();
                        break;
                }
            });

            return UserStore;
        }
    );

    injector.register('miit-user-store', MiitUserStore);
})();