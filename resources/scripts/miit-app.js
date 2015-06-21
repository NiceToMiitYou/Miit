window.MiitApp = (function() {
    var MiitApp = injector.resolve(
        ['miit-router'],
        function(MiitRouter, MiitRealtime) {
            var VERSION   = '0.0.0';
            var COPYRIGTH = 'All rigths reserved to ITEvents.';

            return {
                COPYRIGTH: COPYRIGTH,
                VERSION:   VERSION,
                get: function(serviceName) {
                    return injector.get(serviceName);
                },
                init: function() {
                    // Initialize the router
                    MiitRouter.init();
                }
            };
        }
    );

    return MiitApp();
})();