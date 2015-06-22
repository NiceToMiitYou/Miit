window.MiitApp = (function() {
    var MiitApp = injector.resolve(['miit-router'], function(MiitRouter) {
        var VERSION   = '0.0.0';
        var COPYRIGTH = 'All rigths reserved to ITEvents.';

        var callbacks = [];

        return {
            COPYRIGTH: COPYRIGTH,
            VERSION:   VERSION,
            get: function(serviceName) {
                return injector.get(serviceName);
            },
            onInit: function(cb) {
                if(typeof cb === 'function') {
                    callbacks.push(cb);
                }
            },
            init: function() {
                // Start with callbacks
                for(var index in callbacks) {
                    callbacks[index]();
                }

                // Initialize the router
                MiitRouter.init();
            }
        };
    });

    return MiitApp();
})();