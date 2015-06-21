(function(){
    var MiitPageConstants = injector.resolve(
        ['key-mirror'],
        function(KeyMirror) {
            return {
                ActionTypes: KeyMirror({
                    // Change Page Actions
                    CHANGE_MAIN_PAGE_COMPLETED: null,
                    CHANGE_MIIT_PAGE_COMPLETED: null,
                    CHANGE_APPLICATION_PAGE_COMPLETED: null,
                })
            };
        }
    );

    injector.register('miit-page-constants', MiitPageConstants);
})();