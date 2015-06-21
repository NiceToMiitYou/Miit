(function(){
    var MiitDispatcher = function() {
        return new Flux.Dispatcher();
    };

    injector.register('miit-dispatcher', MiitDispatcher);
})();