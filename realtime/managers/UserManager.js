'use strict';

module.exports = function UserManager() {
    var UserStore = miitoo.get('UserStore');
    var TeamStore = miitoo.get('TeamStore');
    
    var primus = miitoo.get('Primus');
    
    function onGetMe(spark) {
        spark.on('user:me', function(data) {
            var user = spark.request.user;

            UserStore.findUser(user, function(err, user) {
                spark.write({
                    event: 'user:me',
                    user: user
                });
            });
        });
    }

    function onChangePasswordUser(spark) {
        // Response on changed
        function passwordChanged(done) {
            spark.write({
                event: 'user:password',
                done:  done
            });
        }

        spark.on('user:password', function(data) {
            var session = spark.request.user;

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
                                passwordChanged(true);
                            }
                            else
                            {
                                miitoo.logger.error(err);
                                passwordChanged(false);
                            }
                        });
                    }
                    else
                    {
                        miitoo.logger.info('Wrong password.');
                        passwordChanged(false);
                    }
                });
            });
        });
    }

    function onUpdateUser(spark) {
        spark.on('user:update', function(data) {
            var session = spark.request.user;

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
    }

    // On user connection
    primus.on('connection', function(spark) {
        // Handle get user
        onUpdateUser(spark);

        // Handle get user
        onChangePasswordUser(spark);

        // Handle get current user
        onGetMe(spark);
    });
};
