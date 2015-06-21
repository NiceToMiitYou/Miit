(function(){
    var UserStatus = [];

    function _changeStatus(status) {
        var count = UserStatus.length;

        for(var i = 0; i < count; i++)
        {
            if(UserStatus[i].userId === status.userId)
            {
                UserStatus[i].status = status.status;
                return;
            }
        }

        // if not in, add it
        UserStatus.push(status);
    }

    function _getStatusOf(userId) {
        var count = UserStatus.length;

        for(var i = 0; i < count; i++)
        {
            if(UserStatus[i].userId === userId)
            {
                return UserStatus[i].status;
            }
        }

        return 'OFFLINE';
    }

    function _replaceStatus(status) {
        if(Array.isArray(status))
        {
            UserStatus = status;
        }
    }

    var MiitUserStatusStore = injector.resolve(
        ['object-assign', 'key-mirror', 'miit-utils', 'miit-dispatcher', 'miit-user-status-constants'],
        function(ObjectAssign, KeyMirror, MiitUtils, MiitDispatcher, MiitUserStatusConstants) {
            // All action types
            var ActionTypes = MiitUserStatusConstants.ActionTypes;

            var events = KeyMirror({
                STATUS_CHANGED: null
            });

            // The UserStatusStore Object
            var UserStatusStore = ObjectAssign({}, EventEmitter.prototype, {
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