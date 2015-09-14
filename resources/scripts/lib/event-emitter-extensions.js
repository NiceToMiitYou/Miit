'use strict';

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
        if(typeof callback === 'function') {
            self.on(eventName, callback);
        }
    };
    
    this[removeListenerName(eventName)] = function(callback) {
        if(typeof callback === 'function') {
            self.removeListener(eventName, callback);
        }
    };

    this[emitEventName(eventName)] = function() {
        var args = Array.prototype.slice.call(arguments) || [];

        args.unshift(eventName);

        self.emit.apply(this, args);
    };
};