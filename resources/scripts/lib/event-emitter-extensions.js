(function(){

    function addListenerName(eventName) {
        return 'add' + eventName.dashToCapitalize() + 'Listener';
    }
    
    function removeListenerName(eventName) {
        return 'remove' + eventName.dashToCapitalize() + 'Listener';
    }

    function emitEventName(eventName) {
        return 'emit' + eventName.dashToCapitalize();
    }

    EventEmitter.prototype.generateNamedFunctions = function(eventName) {
        var self = this;

        this[addListenerName(eventName)] = function(callback) {
            self.on(eventName, callback);
        };
        
        this[removeListenerName(eventName)] = function(callback) {
            self.removeListener(eventName, callback);
        };

        this[emitEventName(eventName)] = function() {
            self.emit(eventName);
        };
    };

})();