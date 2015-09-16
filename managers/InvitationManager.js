'use strict';

// Define the manager
var manager = miitoo.resolve(
    [ 'MiitConfig', 'TeamStore', 'UserStore', 'InvitationStore', 'UserManager', 'MailManager'],
    function(config, TeamStore, UserStore, InvitationStore, UserManager, MailManager) {

    return {
        invite: function(team, email, roles, cb) {

            InvitationStore
                .invite(team, email, roles, function(err, invitation) {
                    if(err || !invitation)
                    {
                        cb(err || new Error('No invitation created.'));
                
                        return;
                    }

                    var scheme  = (config.domain === 'miit.fr') ? 'https://' : 'http://',
                        port    = (config.domain === 'miit.fr') ? '' : ':' + config.port,
                        urlBase = scheme + team.slug + '.' + config.domain + port,
                        url     = urlBase + '/user/i/' + invitation.token;
                    
                    // Check if owner of the team
                    var owner = -1 !== roles.indexOf('OWNER');

                    // Select rigth template
                    var title    = (owner) ? 'mail.new_miit.object'      : 'mail.invite.object',
                        template = (owner) ? './views/mail/new_miit.ejs' : './views/mail/invite.ejs';

                    // Send the mail to the user asynchronously
                    MailManager.sendMail(email, title, template, {
                        name: team.name,
                        url:  url
                    }, function(err) {
                        if(err) {
                            miitoo.logger.error(err.message);
                            miitoo.logger.error(err.stack);
                        }
                    });

                    // Callback
                    if(typeof cb === 'function') {
                        cb();
                    }
                });
        },

        register: function(team, token, password, cb) {

            // Find the invitation
            InvitationStore
                .getInvitation(team, token, function(err, invitation) {
                    if(err || !invitation) {
                        return;
                    }

                    var email = invitation.email,
                        roles = invitation.roles;

                    UserManager
                        .findUserByEmailOrCreate(email, password, function(err, user) {
                            if(err || !user) {

                                // Log the error
                                if(err) {
                                    miitoo.logger.error(err.message);
                                    miitoo.logger.error(err.stack);
                                }

                                cb(err, user);

                                return;
                            }

                            // Add the user to the team
                            TeamStore
                                .addUser(team, user, roles, function(err) {
                                    if(err) {
                                        return;
                                    }

                                    var callback = function() {
                                        // Remove the invitation
                                        InvitationStore.remove(team, invitation, function() {
                                            
                                            if(typeof cb === 'function') {
                                                cb(null, user);
                                            }
                                        });
                                    };

                                    // If owner register team to user
                                    if(-1 !== roles.indexOf('OWNER')) {
                                        UserStore.addTeam(user, team, callback);
                                    } else {
                                        callback();
                                    }
                                });

                        });
                });
        }
    };
});

// Register the manager
miitoo.register('InvitationManager', manager);
