'use strict';

var Utils = require('../shared/lib/utils');

// Define the manager
var manager = miitoo.resolve(
    ['MiitConfig', 'TeamStore', 'UserStore', 'PasswordResetStore', 'MailManager'],
    function(config, TeamStore, UserStore, PasswordResetStore, MailManager) {

    return {
        findUserByEmailOrCreate: function(email, password, cb) {
            if(!email || !Utils.validator.email(email)) {
                return cb(new Error('No email provided.'));
            }

            if(!password || !Utils.validator.password(password)) {
                return cb(new Error('No password provided.'));
            }

            // Find or create an user by email
            UserStore.findUserByEmail(email, function(err, user) {
                if(err) {
                    return cb(err);
                }

                if(!user) {
                    UserStore.create(email, password, function(errUser, user) {
                        if(errUser) {
                            return cb(errUser);
                        }

                        MailManager.sendMail(email, 'mail.new_account.object', './views/mail/new_account.ejs', {
                            email:    email,
                            password: password
                        }, function(err) {
                            
                            if(err) {
                                miitoo.logger.error(err.message);
                                miitoo.logger.error(err.stack);
                            }
                        });

                        // Callback
                        cb(null, user);
                    });
                }
                else
                {
                    user.validPassword(password, function(result) {
                        if(!result) {
                            return cb(new Error('Wrong password.'));
                        }

                        // Callback
                        cb(null, user);
                    });
                }
            });
        },

        request: function(team, email, cb) {
            if(!email || !Utils.validator.email(email)) {
                return cb(new Error('No email provided.'));
            }

            // Store the slug
            var slug = team.slug || 'user';

            // Find or create an user by email
            UserStore
                .findUserByEmail(email, function(err, user) {

                    // Create the reset password request
                    PasswordResetStore
                        .create(user, function(err, request) {

                            var scheme  = (config.domain === 'miit.fr') ? 'https://' : 'http://',
                                port    = (config.domain === 'miit.fr') ? '' : ':' + config.port,
                                urlBase = scheme  + slug + '.' + config.domain + port,
                                url     = urlBase + '/user/reset/' + request.token;

                            MailManager.sendMail(email, 'mail.password_reset.object', './views/mail/password_reset.ejs', {
                                name: user.name,
                                url:  url
                            }, function(err) {
                                if(err) {
                                    miitoo.logger.error(err.message);
                                    miitoo.logger.error(err.stack);
                                }
                            });

                            // Callback
                            cb(null, user);
                        });
                });
        },

        reset: function(token, password, cb) {
            if(!token || !password || !Utils.validator.password(password))
            {
                return cb(new Error('Not enougth informations provided to reset the password.'));
            }

            PasswordResetStore
                .findByToken(token, function(err, request) {
                    if(err || !request) {
                        return cb(err || new Error('No request found for password reset.'));
                    }

                    UserStore
                        .findUser(request.user, function(err, user) {
                            if(err || !user) {
                                return cb(err || new Error('No user found for password reset.'));
                            }

                            user.password = password;

                            // Change the password
                            user.save(function(err) {
                                // Create the reset password request
                                PasswordResetStore
                                    .remove(user, request, function(err) {

                                        // Callback
                                        cb(null, user);
                                    });
                            });
                        });
                });
        }
    };
});

// Register the manager
miitoo.register('UserManager', manager);
