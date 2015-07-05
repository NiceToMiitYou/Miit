(function(){
    var UserStatus = [];

    function _changeStatus(status) {
        var item = UserStatus.findBy('userId', status.userId);

        if(item) {
            item.status = status.status;
            return;
        }

        // if not in, add it
        UserStatus.push(status);
    }

    function _getStatusOf(userId) {
        var item = UserStatus.findBy('userId', userId);

        if(item) {
            return item.status || 'OFFLINE';
        }

        return 'OFFLINE';
    }

    function _replaceStatus(status) {
        UserStatus = status || [];
    }

    var MiitUserStatusStore = injector.resolve(
        ['object-assign', 'key-mirror', 'miit-dispatcher', 'miit-user-status-constants', 'miit-team-store'],
        function(ObjectAssign, KeyMirror, MiitDispatcher, MiitUserStatusConstants, TeamStore) {
            // All action types
            var ActionTypes = MiitUserStatusConstants.ActionTypes;

            var events = KeyMirror({
                STATUS_CHANGED: null
            });

            // The UserStatusStore Object
            var UserStatusStore = ObjectAssign({}, EventEmitter.prototype, {
                getUsers: function(filtered) {
                    if(true === filtered) {
                        return TeamStore.getUsers();
                    }

                    var users = [];

                    users.mergeBy('id',
                        UserStatus.map(function(status) {
                            return TeamStore.getUser(status.userId);
                        })
                    );
                    users.mergeBy('id', TeamStore.getUsers());

                    return users;
                },

                getUserStatus: function() {
                    return UserStatus;
                },

                getUserStatusByUserId: function(userId) {
                    return _getStatusOf(userId);
                }
            });

            // Register Functions based on event
            UserStatusStore.generateNamedFunctions(events.STATUS_CHANGED);

            // Handle actions
            UserStatusStore.dispatchToken = MiitDispatcher.register(function(action){
                switch(action.type) {
                    case ActionTypes.REFRESH_USER_STATUS:
                        
                        // Replace all status
                        _replaceStatus(action.status);

                        // Emit the status changed event
                        UserStatusStore.emitStatusChanged(); 
                        break;

                    case ActionTypes.UPDATE_USER_STATUS:
                        
                        // Change the status
                        _changeStatus(action.status);

                        // Emit the status changed event
                        UserStatusStore.emitStatusChanged(); 
                        break;
                }
            });

            return UserStatusStore;
        }
    );

    injector.register('miit-user-status-store', MiitUserStatusStore);
})();