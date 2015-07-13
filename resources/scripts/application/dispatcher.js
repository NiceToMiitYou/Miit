
// Instanciate the dispatcher for Flux
var dispatcher = null;

if(Flux && Flux.Dispatcher) {
    dispatcher = new Flux.Dispatcher();
}

module.exports = dispatcher;