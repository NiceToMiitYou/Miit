
// Regex for email
var RegexEmail    = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

// Load Utils
var Utils = require('../shared/lib/utils');

// The controller for public part of the site
var controller = miitoo.resolve(
    ['Slugify', 'RestResponse', 'WWWRoutes', 'UserManager', 'TeamManager', 'MailChimp', 'MailChimpConfig', 'i18nConfig'],
    function(slugify, response, app, UserManager, TeamManager, MailChimp, MailChimpConfig, i18nConfig) {
    
    // Index route
    app.get(/^\/(fr|en)?\/?$/, function(req, res) {
        // Extract local from config
        var locales = i18nConfig.locales,
            locale  = req.params[0] || req.getLocale();

        res.cookie('miit-locale', locale, { maxAge: 900000, httpOnly: true });
        req.setLocale(locale);

        return res.render('www/index', {
            locales: locales
        });
    });

    // Create register route
    app.post('/register', function(req, res) {
        // Get parameters
        var email = req.body.email,
            name  = req.body.name;

        if(!email || !name || !Utils.validator.email(email)) {
            return;
        }

        TeamManager.create(email, name, function(err, team) {
            return response(res, err);
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