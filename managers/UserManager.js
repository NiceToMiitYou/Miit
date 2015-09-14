'use strict';

var Utils = require('../shared/lib/utils');

// Define the manager
var manager = miitoo.resolve(
    ['MiitConfig', 'TeamStore', 'UserStore', 'UserModel', 'MailManager'],
    function(config, TeamStore, UserStore, User, MailManager) {

    return {
        findUserByEmailOrCreate: function(email, password, cb) {
            if(!email) {
                return cb(new Error('No email provided.'));
            }

            if(!password) {
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
                        }, function(error) {
                            
                            // Callback
                            cb(null, user);
                        });
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

        invite: function(team, invitation, email, owner, cb) {

            TeamStore.findTeam(team, function(err, team) {
                if(err || !team) {
                    return;
                }

                var scheme = (config.domain === 'miit.fr') ? 'https://' : 'http://';
                var port   = (config.domain === 'miit.fr') ? '' : ':' + config.port;
                var url    = scheme + team.slug + '.' + config.domain + port + '/user/i/' + invitation;
                
                var title    = (owner) ? 'mail.new_miit.object'      : 'mail.invite.object',
                    template = (owner) ? './views/mail/new_miit.ejs' : './views/mail/invite.ejs';

                // Send the mail to the user
                MailManager.sendMail(email, title, template, {
                    name:      team.name,
                    url:       url
                }, function(err) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err);
                    }
                });
            });
        }
    };
});

// Register the manager
miitoo.register('UserManager', manager);
