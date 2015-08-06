
// Load express-session
var bodyParser = require('body-parser');
var compress   = require('compression');
var subdomain  = require('miitoo/lib/middleware/subdomain');

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
miitoo.register('WWWRoutes',      express.Router);
miitoo.register('TeamRoutes',     express.Router);
miitoo.register('MandrillRoutes', express.Router);

// Define the middlewares
var configurator = miitoo.resolve(
    ['ExpressApp', 'Mongoose', 'WWWRoutes', 'TeamRoutes', 'MandrillRoutes'],
    function(app, mongoose, wwwRoutes, teamRoutes, mandrillRoutes) {
    
    app.engine('ejs', require('ejs').renderFile);
    
    app.set('view engine', 'ejs');

    // Enable Gzip compression
    app.use(compress({
        level: 9
    })); 
    
    // parse application/json
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // Handle Routes by subdomain
    app.use(subdomain('www', wwwRoutes));
    app.use(subdomain('mdl', mandrillRoutes));
    app.use(subdomain('*',   teamRoutes));
});

miitoo.once('before:start', configurator);