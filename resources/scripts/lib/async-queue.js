
;(function () {
    'use strict';

    // AsyncQueue class
    function AsyncQueue(worker, concurrency) {
        if (typeof concurrency === 'undefined') {
            concurrency = 1;
        }
        else if(concurrency === 0) {
            throw new Error('Concurrency must not be zero.');
        }
        if(typeof worker !== 'function') {
            throw new Error('Worker must be a function.');
        }

        // define all variables needed
        var handler;
        var tasks  = [];
        var active = 0;
        var next   = function() {
            return true;
        };

        // Shift out the process
        function shift() {
            // check if we can run an other process
            if( 
                tasks.length > 0     &&
                active < concurrency &&
                true === next()
            ) {
                // Retrieve the process
                var process = tasks.shift();

                // Execute the task
                if(typeof process === 'function') {
                    process();
                }
            }
        }

        // The callback of the process
        function callback() {
            return function(e) {
                // Check for errors
                if( typeof e       !== 'undefined' &&
                    typeof handler === 'function') {
                    // Throw the error to the handler
                    setTimeout(handler.bind(null, e));
                }

                // Define inactive
                active--;

                // Pop an other process
                shift();
            };
        }

        // Push to a process
        this.push = function(data) {
            // Put the process in the list
            tasks.push(function() {
                // A new task is active
                active++;

                var args = [];
                // Put data and callback
                args.push(data);
                args.push(callback());

                // Send in background the process
                setTimeout(function() {                
                    worker.apply(null, args);
                });
            });

            // Pop an other process
            shift();
        };

        // Handle the error
        this.onError = function(h) {
            handler = h;
        };

        // Define the condition for execute the next process
        this.setNext = function(n) {
            next = n || next;

            // Pop an other process in case of rules change
            shift();
        };

        // Information about AsyncQueue
        this.COPYRIGTH = 'Tacyniak Boris <tacyniak.boris@itevents.fr>';
        this.VERSION   = '0.0.0';
    }

    this.AsyncQueue = AsyncQueue;
}.call(this));