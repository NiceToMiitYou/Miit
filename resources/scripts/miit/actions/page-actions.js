(function(){
    var PageActions = injector.resolve(
        ['miit-dispatcher', 'miit-page-constants'],
        function(MiitDispatcher, MiitPageConstants) {
            var ActionTypes = MiitPageConstants.ActionTypes;

            return {
                changeMainPage: function(main) {
                    var action = {
                        type: ActionTypes.CHANGE_MAIN_PAGE_COMPLETED,
                        mainPage: main
                    };

                    MiitDispatcher.dispatch(action);
                },

                changeApplicationPage: function(main, miit, application) {
                    var action = {
                        type: ActionTypes.CHANGE_APPLICATION_PAGE_COMPLETED,
                        mainPage: main,
                        applicationPage: application
                    };

                    MiitDispatcher.dispatch(action);
                }
            };
        }
    );

    injector.register('miit-page-actions', PageActions);
})();