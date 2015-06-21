//Load mongoose
var mongoose = require('mongoose');

// Load the configuration
var config = miitoo.get('MongoConfig');

// Connect to the mongo server
mongoose.connect(config.uri, config.options);

// Handle connection event like connection and error
mongoose.connection.once('open', miitoo.logger.debug.bind(miitoo.logger.debug, 'Mongo connection opened.'));
mongoose.connection.on('error',  miitoo.logger.debug.bind(miitoo.logger.debug, 'Mongo connection error:'));

// Close mongoose when closing
miitoo.on('after:close', function() {
    mongoose.disconnect();
});

// Register the Mongoose instance as a singleton
miitoo.register('Mongoose', mongoose, true);