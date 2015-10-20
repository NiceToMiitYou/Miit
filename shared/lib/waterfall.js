'use strict';

function waterfall(cb) {
    // the last call back and the list of callbacks
    var last      = cb,
        callbacks = [];

    // Call the next callback
    function nextCallback() {
        var func = callbacks.shift();

        if(typeof func === 'function') {

            func.call({}, nextCallback);
        }
    }

    this.push = function(cb) {
        callbacks.push(cb);
    };

    this.run  = function() {
        // Add the last callback
        callbacks.push(last);

        // Run the first one
        nextCallback();
    };
}

module.exports = waterfall;