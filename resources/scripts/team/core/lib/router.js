'use strict';

var Router = require('director').Router;

var router, routes = new DataStore('routes');

module.exports = {
    init: function() {
        router = Router(routes.getData());

        router.configure({
            html5history: true,
            run_handler_in_init: true,
            convert_hash_in_init: true
        });

        router.init();
    },

    routes: routes,

    setRoute: function(path) {
        var delay = (typeof window.onpopstate !== 'function') ? 600: 0;

        setTimeout(function() {
            router.setRoute(path);
        }, delay);
    }
};