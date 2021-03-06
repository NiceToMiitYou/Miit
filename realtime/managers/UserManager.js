'use strict';

var Utils = require('../../shared/lib/utils');

module.exports = function UserManager() {
    var UserStore          = miitoo.get('UserStore'),
        UserManager        = miitoo.get('UserManager'),
        InvitationStore    = miitoo.get('InvitationStore'),
        InvitationManager  = miitoo.get('InvitationManager'),
        PasswordResetStore = miitoo.get('PasswordResetStore');

    var Dispatcher = miitoo.get('RealtimeDispatcher');

    var primus = miitoo.get('Primus');
    
    // Handle get informations of the user
    Dispatcher.register('user:me', function onGetMe(spark, data, team, user) {
        // Find me
        UserStore.findUser(user, function(err, user) {
            spark.write({
                event: 'user:me',
                user: user
            });
        });
    });

    function notDone(spark, event, err) {
        if(err)
        {
            miitoo.logger.error(err);
        }

        spark.write({
            event: event,
            done:  false
        });
    }

    // Handle update password informations of the user
    Dispatcher.register('user:password', function onChangePasswordUser(spark, data, team, session) {
        var password_old = data.old;
        var password_new = data.new;

        if(!password_old || !password_new || !session || !Utils.validator.password(password_new))
        {
            return;
        }

        // Find the user
        UserStore.findUser(session, function(err, user) {
            if(err || !user)
            {
                return;
            }

            // Check the password
            user.validPassword(password_old, function(result) {
                if(true === result) {
                    // Save the user
                    user.password = password_new || user.password;

                    user.save(function(errSave) {
                        if(errSave)
                        {
                            return;
                        }

                        spark.write({
                            event: 'user:password',
                            done:  true
                        });
                    });
                }
                else
                {
                    notDone(spark, 'user:password', new Error('Wrong password.'));
                }
            });
        });
    });

    // Handle update informations of the user
    Dispatcher.register('user:update', function onUpdateUser(spark, data, team, session) {
        var name = data.name;

        if(!name || !session)
        {
            return;
        }

        // Find the user
        UserStore.findUser(session, function(err, user) {
            if(err || !user)
            {
                return;
            }

            // Save the user
            user.name = name || user.name;

            user.save(function(err) {
                if(err)
                {
                    return;
                }

                spark.write({
                    event: 'user:update',
                    name:  user.name
                });

                primus.in(team.id).write({
                    event: 'team:user:update',
                    id:    user.id,
                    name:  user.name
                });
            });
        });
    });

    // Handle get invitation
    Dispatcher.register('user:invitation:get', function onGetInvitationUser(spark, data, team) {
        var token = data.token;

        if(!token)
        {
            return;
        }

        // Find the invitation
        InvitationStore.getInvitation(team, token, function(err, invitation) {
            
            var email = (invitation || {}).email || '';

            UserStore
                .findUserByEmail(email, function(err, user) {

                    // Send the invitation
                    spark.write({
                        event:      'user:invitation:get',
                        invitation: invitation,
                        user:       user
                    });
                });
        });
    });

    // Handle register invitation
    Dispatcher.register('user:invitation:register', function onRegisterInvitationUser(spark, data, team) {
        var token    = data.token,
            password = data.password;

        if(!token || !password || !Utils.validator.password(password))
        {
            return;
        }

        // Find the invitation
        InvitationManager
            .register(team, token, password, function(err, user) {
                
                spark.write({
                    event: 'user:invitation:register',
                    user:  user 
                });

                // Disconnect the park
                Dispatcher.disconnect(spark);

                // Dispatch the login request
                Dispatcher.dispatch(spark, 'login:password', {
                    email:    user.email,
                    password: password
                });
            });
    });

    // Handle password get
    Dispatcher.register('user:password:get', function onGetPasswordUser(spark, data, team) {
        var token = data.token;

        if(!token)
        {
            return;
        }

        PasswordResetStore
            .findByToken(token, function(err, request) {
                if(err || !request) {
                    // Confirm password request
                    spark.write({
                        event: 'user:password:get'
                    });
                    
                    return;
                }

                // Find the user
                UserStore
                    .findUser(request.user, function(err, user) {

                        var temp = user.toJSON();
                        
                        // Include the email for the user
                        temp.email = user.email;

                        // Confirm password request
                        spark.write({
                            event: 'user:password:get',
                            user:  temp
                        });
                    });
            });
    });

    // Handle password request
    Dispatcher.register('user:password:request', function onRequestPasswordUser(spark, data, team) {
        var email = data.email;

        UserManager
            .request(team, email, function(err, user) {

                // Confirm password request
                spark.write({
                    event: 'user:password:request'
                });
            });
    });

    // Handle password request
    Dispatcher.register('user:password:reset', function onResetPasswordUser(spark, data, team) {
        var token    = data.token,
            password = data.password;

        UserManager
            .reset(token, password, function(err, user) {
                if(err || !user) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    return;
                }

                // Confirm password reset
                spark.write({
                    event: 'user:password:reset'
                });
            });
    });
};
