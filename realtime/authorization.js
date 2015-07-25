
var authorization = miitoo.resolve(['Primus', 'MiitConfig', 'TeamStore'], function(primus, config, TeamStore) {

    function extractSubdomain(host) {
        // Remove the port
        var hostname  = (host.split(':', 1) || [])[0] || host;

        // Remove the domain
        return hostname.replace('.' + config.domain, '');
    }

    // Authorization function
    function authorize(req, done) {
        var slug  = extractSubdomain(req.headers.host);

        if(!slug) {
            return done({
                statusCode: 403,
                message: 'Go away!'
            });
        }
        else
        {
            TeamStore.findTeamBySlug(slug, function(err, team) {
                if(err || !team) {
                    return done({
                        statusCode: 403,
                        message: 'Go away!'
                    });
                }

                req.team  = team.id;
                req.user  = {};
                req.roles = ['ANONYM'];

                return done();
            });
        }
    }

    // register the function
    primus.authorize(authorize);
});

miitoo.once('after:start', authorization);