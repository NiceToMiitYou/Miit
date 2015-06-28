(function(){
    var TeamActions = injector.resolve(
        ['miit-dispatcher', 'miit-team-constants', 'miit-realtime'],
        function(MiitDispatcher, MiitTeamConstants, MiitRealtime) {
            var ActionTypes = MiitTeamConstants.ActionTypes;

            // Handle promote
            MiitRealtime.on('team:promote', function(data) {
                var action = {
                    type: (data.done) ? ActionTypes.PROMOTE_USER_COMPLETED :
                                        ActionTypes.PROMOTE_USER_ERROR,
                    id:    data.id,
                    roles: data.roles
                };

                MiitDispatcher.dispatch(action);
            });

            // Handle demote
            MiitRealtime.on('team:demote', function(data) {
                var action = {
                    type: (data.done) ? ActionTypes.DEMOTE_USER_COMPLETED :
                                        ActionTypes.DEMOTE_USER_ERROR,
                    id:    data.id,
                    roles: data.roles
                };

                MiitDispatcher.dispatch(action);
            });

            // Handle remove
            MiitRealtime.on('team:remove', function(data) {
                var action = {
                    type: (data.done) ? ActionTypes.REMOVE_USER_COMPLETED :
                                        ActionTypes.REMOVE_USER_ERROR,
                    id: data.id
                };

                MiitDispatcher.dispatch(action);
            });

            // Handle invite
            MiitRealtime.on('team:invite', function(data) {
                var action = {
                    type: (data.done) ? ActionTypes.INVITE_USER_COMPLETED :
                                        ActionTypes.INVITE_USER_ERROR,
                    user: data.user
                };

                MiitDispatcher.dispatch(action);
            });

            // Handle update
            MiitRealtime.on('team:update', function(data) {
                var action = {
                    type: (data.done) ? ActionTypes.UPDATE_TEAM_COMPLETED :
                                        ActionTypes.UPDATE_TEAM_ERROR,
                    name:   data.name,
                    public: data.public
                };

                MiitDispatcher.dispatch(action);
            });

            // Handle refresh
            MiitRealtime.on('team:users', function(data) {
                var action = {
                    type:  ActionTypes.REFRESH_USERS_COMPLETED,
                    users: data.users
                };

                MiitDispatcher.dispatch(action);
            });

            var obj = {
                refresh: function() {
                    MiitRealtime.send('team:users');
                },

                update: function(name, publix) {
                    MiitRealtime.send('team:update', {
                        name:     name,
                        'public': publix
                    });
                },

                invite: function(email) {
                    MiitRealtime.send('team:invite', {
                        email: email
                    });
                },

                promote: function(id, roles) {
                    MiitRealtime.send('team:promote', {
                        id:    id,
                        roles: roles
                    });
                },

                demote: function(id, roles) {
                    MiitRealtime.send('team:demote', {
                        id:    id,
                        roles: roles
                    });
                },

                remove: function(id) {
                    MiitRealtime.send('team:remove', {
                        id: id
                    });
                }
            };

            return obj;
        }
    );

    injector.register('miit-team-actions', TeamActions);
})();