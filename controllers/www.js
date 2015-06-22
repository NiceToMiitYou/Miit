
var controller = miitoo.resolve(
    ['Slugify', 'RestResponse', 'WWWRoutes', 'UserManager', 'TeamManager'],
    function(slugify, response, app, UserManager, TeamManager) {
    
    // Index route
    app.get('/', function(req, res) {

        res.render('www/index');
    });

    // Create register route
    app.post('/register', function(req, res) {
        // Get parameters
        var email = req.body.email;
        var name  = req.body.name;

        // Create the team
        UserManager.findUserByEmailOrCreate(email, function(err, user) {
            if(err) {
                return response(res, err);
            }

            TeamManager.createTeam(user, name, function(errTeam, team) {
                return response(res, errTeam);
            });
        });
    });

    // Register newsletter route
    app.post('/newsletter', function(req, res) {

        var email = req.body.email;

        if(email)
        {
            return res.json({
                done: true
            });
        }

        return res.json({
            done: false
        });
    });
});

miitoo.once('before:start', controller);