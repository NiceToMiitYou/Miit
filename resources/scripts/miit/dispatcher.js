(function(){
    injector.register('miit-dispatcher', function() {
        if(!Flux.Dispatcher) {
            return;
        }
        return new Flux.Dispatcher();
    });
})();