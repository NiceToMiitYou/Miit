(function(){
    var MiitRealtime = injector.resolve(function() {
        // Initiliaze primus            
        var primus    = Primus.connect(),
            connected = false,
            retry     = 1;

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
            retry     = 1;
            connected = true;
        });

        // Listenen for end
        primus.on('end', function closed() {
            // Set as not connected and reconnect
            connected = false;
            reconnect();
        });

        return {
            send: function(eventName, data) {
                if(!data) {
                    data = {};
                }

                data.event = eventName;

                primus.write(data);
            },

            on: function(eventName, cb) {
                primus.on(eventName, cb);
            }
        };
    });

    injector.register('miit-realtime', MiitRealtime);
})();