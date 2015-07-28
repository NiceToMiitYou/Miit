'use strict';

// Initiliaze primus            
var primus      = Primus.connect(),
    initialized = false,
    connected   = false,
    retry       = 1;

function reconnect() {
    retry *= 1.3;

    if(false === connected) {

        // Retry after
        setTimeout(
            primus.open.bind(primus),
            Math.round(1000 * retry)
        );
    }
}

// Listen all data
primus.on('data', function(data) {
    console.log(data);

    if(primus.reserved(data.event)) return;

    primus.emit.call(primus, data.event, data);
});

// Listen for connection
primus.on('open', function() {
    retry       = 1;
    connected   = true;
    initialized = true;
});

// Listenen for end
primus.on('end', function closed() {
    // Set as not connected and reconnect
    connected = false;
    reconnect();
});

// Create an async queue to deserve data
var queue = new AsyncQueue(function(data, next) {
    console.log('Send:', data);

    primus.write(data);

    next();
});

// Be sure to cut of data sending during disconnection
queue.setNext(function() {
    return connected || !initialized;
});

module.exports = {
    send: function(eventName, data) {
        if(!data) {
            data = {};
        }

        data.event = eventName;

        // Push data in the queue
        queue.push(data);
    },

    on: function(eventName, cb) {
        primus.on(eventName, cb);
    }
};