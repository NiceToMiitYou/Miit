(function(){
    var NotificationsActions = injector.resolve(
        ['miit-dispatcher', 'miit-notifications-constants'],
        function(MiitDispatcher, MiitNotificationsConstants) {
            var ActionTypes = MiitNotificationsConstants.ActionTypes;

            return {
                new: function(type, text) {
                    var action = {
                        type: ActionTypes.NEW_NOTIFICATION,
                        category: type || 'info',
                        text: text
                    };

                    MiitDispatcher.dispatch(action);
                }
            };
        }
    );

    injector.register('miit-notifications-actions', NotificationsActions);
})();