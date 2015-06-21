var injector = (function() {
    function Injector() {
    
        var dependencies = {};
        var instances = {};

        // Register a service
        this.register = function(key, value) {
            dependencies[key] = value;
        };

        // Resolve all dependencies for a service
        this.resolve = function() {
            var func, deps, scope, args = [];

            if(typeof arguments[0] === 'string')
            {
                func = arguments[1];
                deps = arguments[0].replace(/ /g, '').split(',');
                scope = arguments[2] || {};
            }
            else if(Array.isArray(arguments[0]))
            {
                func = arguments[1];
                deps = arguments[0];
                scope = arguments[2] || {};
            }
            else
            {
                func = arguments[0];
                deps = func.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].replace(/ /g, '').split(',');
                scope = arguments[1] || {};
            }

            return function() {
                var a = Array.prototype.slice.call(arguments, 0);

                for(var i=0; i<deps.length; i++) {
                    var d = deps[i];

                    if(!instances[d] && typeof dependencies[d] === 'function') {
                        instances[d] = dependencies[d]();
                    }

                    args.push(instances[d] && d !== '' ? instances[d] : a.shift());
                }

                return func.apply(scope || {}, args);
            };
        };

        // Get on service
        this.get = function(serviceName) {
            var proxyService = this.resolve(serviceName, function(service) {
                return service;
            });

            return proxyService();
        };
    }

    return new Injector();
})();