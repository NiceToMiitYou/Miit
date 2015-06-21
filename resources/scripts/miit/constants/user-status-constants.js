(function(){
    var MiitUserStatusConstants = injector.resolve(
        ['key-mirror'],
        function(KeyMirror) {
            return {
                ActionTypes: KeyMirror({
                    // Change status Actions
                    REFRESH_USER_STATUS: null,
                    UPDATE_USER_STATUS: null
                })
            };
        }
    );

    injector.register('miit-user-status-constants', MiitUserStatusConstants);
})();