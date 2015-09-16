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





                });
        }
    };
});

// Register the manager
miitoo.register('UserManager', manager);
