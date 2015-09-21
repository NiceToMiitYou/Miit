
var Realtime = require('core/lib/realtime');

Realtime.on('server:time', function(data) {

    // Get the difference of client date and server date
    global.ServerTimeOffset = new Date(data.date) - new Date();
});
