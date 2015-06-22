(function(){
    var TeamActions = injector.resolve(
        ['miit-dispatcher', 'miit-team-constants', 'miit-realtime', 'miit-team-request'],
        function(MiitDispatcher, MiitTeamConstants, MiitRealtime, MiitTeamRequest) {
            var ActionTypes = MiitTeamConstants.ActionTypes;

            // Handle promote
            var onPromoted = function(id, roles, data) {
                var action = {
                    type: (data.done) ? ActionTypes.PROMOTE_USER_COMPLETED :
                                        ActionTypes.PROMOTE_USER_ERROR,
                    id: id,
                    roles: roles
                };

                MiitDispatcher.dispatch(action);
            };

            // Handle demote
            var onDemoted = function(id, roles, data) {
                var action = {
                    type: (data.done) ? ActionTypes.DEMOTE_USER_COMPLETED :
                                        ActionTypes.DEMOTE_USER_ERROR,
                    id: id,
                    roles: roles
                };

                MiitDispatcher.dispatch(action);
            };

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
            var onRefresh = function(data) {
                var action = {
                    type:  ActionTypes.REFRESH_USERS_COMPLETED,
                    users: data.users
                };

                MiitDispatcher.dispatch(action);
            };

            MiitRealtime.on('team:users', onRefresh);

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
                    MiitTeamRequest.promote(id, roles, onPromoted.bind({}, id, roles));
                },

                demote: function(id, roles) {
                    MiitTeamRequest.demote(id, roles, onDemoted.bind({}, id, roles));
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