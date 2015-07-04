(function(){
    var UserStatusActions = injector.resolve(
        ['miit-dispatcher', 'miit-user-status-constants', 'miit-realtime'],
        function(MiitDispatcher, MiitUserStatusConstants, MiitRealtime) {
            var ActionTypes = MiitUserStatusConstants.ActionTypes;

            var sending = false;

            function onStatusUpdate(data) {
                var action = {
                    type:   ActionTypes.UPDATE_USER_STATUS,
                    status: data.status
                };

                MiitDispatcher.dispatch(action);
            }

            function onStatusRefresh(data) {
                sending = false;

                var action = {
                    type:   ActionTypes.REFRESH_USER_STATUS,
                    status: data.status
                };

                MiitDispatcher.dispatch(action);
            }

            MiitRealtime.on('status:user', onStatusUpdate);

            MiitRealtime.on('status:users', onStatusRefresh);

            var obj = {
                refresh: function() {
                    if(false === sending) {
                        sending = true;

                        MiitRealtime.send('status:users');
                    }
                }
            };

            // Refresh the whole list
            obj.refresh();

            return obj;
        }
    );

    injector.register('miit-user-status-actions', UserStatusActions);
})();
