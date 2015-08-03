// Get the instance of the framework
var Framework = require('miitoo').Miitoo;

// Instanciate the Miitoo Framework
var Miitoo = new Framework();

Miitoo.load(__dirname + '/config');
Miitoo.load(__dirname + '/startup');
Miitoo.load(__dirname + '/models');
Miitoo.load(__dirname + '/stores');
Miitoo.load(__dirname + '/managers');
Miitoo.load(__dirname + '/controllers');
Miitoo.load(__dirname + '/realtime');
Miitoo.load(__dirname + '/workers');

Miitoo.start();
