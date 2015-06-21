
// Load express-session
var bodyParser   = require('body-parser');
var subdomain    = require('miitoo/lib/middleware/subdomain');

// Load express dependency
var express = miitoo.get('Express');

// Create an helper for responses
function handleResponse(res, err, extra) {
    extra = extra || {};

    if(typeof extra.done !== 'boolean')
    {
        extra.done = true;
    }

    if(err)
    {
        extra.done  = false;
        extra.error = err.message;
        
        miitoo.logger.error(err);
    }

    miitoo.logger.debug('Data sent:', extra);

    return res.json(extra);
}

// Register the helper
miitoo.register('RestResponse', handleResponse, true);

// Register routes
miitoo.register('WWWRoutes',  express.Router);
miitoo.register('TeamRoutes', express.Router);

// Define the middlewares
var configurator = miitoo.resolve(
    ['ExpressApp', 'Mongoose', 'WWWRoutes', 'TeamRoutes'],
    function(app, mongoose, wwwRoutes, teamRoutes) {
    
    app.engine('ejs', require('ejs').renderFile);
    
    app.set('view engine', 'ejs');

    // parse application/json
    app.use(bodyParser.json());

    // Handle Routes by subdomain
    app.use(subdomain('www', wwwRoutes));
    app.use(subdomain('*',   teamRoutes));
});

miitoo.once('before:start', configurator);