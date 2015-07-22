
var controller = miitoo.resolve(
    ['Lodash', 'MiitConfig', 'ApplicationsConfig', 'TeamRoutes', 'TeamStore'],
    function(_, config, applications, app, TeamStore) {
    
    // Find the team and allow the user if exist
    app.use(function(req, res, next) {
        var slug = _.first(req.subdomains);

        TeamStore.findTeamBySlug(slug, function(err, team) {
            if(err) {
                miitoo.logger.error(err);
            }
            
            if(!team) {
                var port = (config.port === 80) ? '' : ':' + config.port;
                var url  = 'http://www.' + config.domain + port + '/';

                return res.redirect(url);
            }

            // Define values for the request
            req.team = team;

            next();
        });
    });

    // Catch all others request
    app.all('*', function(req, res) {
        return res.render('team/index', {
            team: req.team,
            user: req.user || { roles: ['ANONYM'] },
            apps: applications
        });
    });
});

miitoo.once('before:start', controller);