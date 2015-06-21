(function(){
    var MiitNotifiactionsConstants = injector.resolve(
        ['key-mirror'],
        function(KeyMirror) {
            return {
                ActionTypes: KeyMirror({
                    // Session Actions
                    NEW_NOTIFICATION:   null
                })
            };
        }
    );

    injector.register('miit-notifications-constants', MiitNotifiactionsConstants);
})();