
// Regex for email
var RegexEmail    = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

// The controller for public part of the site
var controller = miitoo.resolve(
    ['Slugify', 'RestResponse', 'WWWRoutes', 'UserManager', 'TeamManager', 'MailChimp', 'MailChimpConfig'],
    function(slugify, response, app, UserManager, TeamManager, MailChimp, MailChimpConfig) {
    
    // Index route
    app.get('/', function(req, res) {

        res.render('www/index');
    });

    // Create register route
    app.post('/register', function(req, res) {
        // Get parameters
        var email = req.body.email;
        var name  = req.body.name;

        if(!email || !name) {
            return;
        }

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
        // Get the email
        var email = req.body.email;

        // Check if it's an email
        if(RegexEmail.test(email))
        {
            MailChimp.lists.subscribe({
                id: MailChimpConfig.newsletter_list_id,
                email:{
                    email: email
                },
                double_optin: false
            }, function(data) {
                miitoo.logger.debug('Email added to the newsletter:', email);

                return res.json({
                    done: true
                });
            }, function(error) {
                if(error.error) {
                    miitoo.logger.debug('Email added to the newsletter:', error.code, '-', error.error);
                }

                return res.json({
                    done: !error.error
                });
            });
        }
        else
        {
            miitoo.logger.debug('This is not an email:', email);

            return res.json({
                done: false
            });
        }
    });
});

miitoo.once('before:start', controller);