'use strict';

module.exports = function UserManager() {
    var UserStore = miitoo.get('UserStore');
    var TeamStore = miitoo.get('TeamStore');

    var Dispatcher = miitoo.get('RealtimeDispatcher');
    
    // Handle get informations of the user
    Dispatcher.on('user:me', function onGetMe(spark, data, team, user) {
        // Find me
        UserStore.findUser(user, function(err, user) {
            spark.write({
                event: 'user:me',
                user: user
            });
        });
    });

    // Response on changed
    function passwordChanged(spark, done) {
        spark.write({
            event: 'user:password',
            done:  done
        });
    }

    // Handle update password informations of the user
    Dispatcher.on('user:password', function onChangePasswordUser(spark, data, team, session) {
        var password_old = data.old;
        var password_new = data.new;

        if(!password_old || !password_new || !session)
        {
            return;
        }

        // Find the user
        UserStore.findUser(session.id, function(err, user) {
            if(err || !user)
            {
                return;
            }

            // Check the password
            user.validPassword(password_old, function(result) {
                if(true === result) {
                    // Save the user
                    user.password = password_new || user.password;
                    user.save(function(err) {
                        if(!err)
                        {
                            passwordChanged(spark, true);
                        }
                        else
                        {
                            miitoo.logger.error(err);
                            passwordChanged(spark, false);
                        }
                    });
                }
                else
                {
                    miitoo.logger.info('Wrong password.');
                    passwordChanged(spark, false);
                }
            });
        });
    });

    // Handle update informations of the user
    Dispatcher.on('user:update', function onUpdateUser(spark, data, team, session) {
        var name = data.name;

        if(!name || !session)
        {
            return;
        }

        // Find the user
        UserStore.findUser(session.id, function(err, user) {
            if(err || !user)
            {
                return;
            }

            // Save the user
            user.name = name || user.name;

            user.save(function(err) {
                if(!err)
                {
                    spark.write({
                        event: 'user:update',
                        done:  true,
                        name:  user.name
                    });
                }
                else
                {
                    spark.write({
                        event: 'user:update',
                        done:  false
                    });
                    miitoo.logger.error(err);
                }
            });
        });
    });
};
