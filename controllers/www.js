
var controller = miitoo.resolve(
    ['Slugify', 'RestResponse', 'MiitConfig', 'WWWRoutes', 'UserStore', 'TeamStore', 'UserModel', 'TeamModel'],
    function(slugify, response, config, app, UserStore, TeamStore, User, Team) {
    
    function generatePassword() {
        var password = '';

        // Loop for password length
        for(var i = 0; i <= 1; i++) {
            password += Math.random().toString(36).slice(-8);
        }

        return password;
    }

    // Index route
    app.get('/', function(req, res) {

        res.render('www/index');
    });

    // Create register route
    app.post('/register', function(req, res) {

        var email = req.body.email;
        var name  = req.body.name;
        var slug  = slugify(name);

        if(slug.length < 4 || 0 <= config.restrict.subdomains.indexOf(slug)) {
            return response(res, new Error('Restricted name.'));
        }

        // Create the team
        function createTeam(err, user) {
            // Create the team
            var team = new Team({
                name: name,
                slug: slug,
                applications: ['APP_CHAT']
            });
            
            // Save the team
            team.save(function(errTeam) {
                if(!errTeam)
                {
                    TeamStore.addUser(team, user, ['USER', 'ADMIN', 'OWNER'], function(errAdded) {
                        return response(res, errAdded);
                    });
                }
                else
                {
                    return response(res, errTeam);
                }
            });
        }

        UserStore.findUserByEmail(email, function(err, user) {
            if(err) {
                return response(res, err);
            }

            if(!user) {
                // Create the user
                user = new User({
                    email:    email,
                    password: generatePassword()
                });

                // Log the user informations
                miitoo.logger.debug(user);

                // save it
                user.save(function(errUser) {
                    if(errUser) {
                        return response(res, errUser);
                    }
                    // Then create the team
                    createTeam(errUser, user);
                });
            }
            else
            {
                // Create the team
                createTeam(err, user);
            }
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