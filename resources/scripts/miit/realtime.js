(function(){
    var MiitRealtime = injector.resolve(function() {
        // Initiliaze primus            
        var primus = Primus.connect();

        // Bind incoming data
        var onData = function(data) {
            console.log(data);

            if(primus.reserved(data.event)) return;

            primus.emit.call(primus, data.event, data);
        };

        // Listen all data
        primus.on('data', onData);

        return {
            send: function(eventName, data) {
                if(!data) {
                    data = {};
                }

                data.event = eventName;

                primus.write(data);
            },

            sendIn: function(roomName, eventName, data) {
                if(!data) {
                    data = {};
                }

                data.event = eventName;

                primus.in(roomName).write(data);
            },

            on: function(eventName, cb) {
                primus.on(eventName, cb);
            }
        };
    });

    injector.register('miit-realtime', MiitRealtime);
})();