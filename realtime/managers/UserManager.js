'use strict';

module.exports = function UserManager() {
    var UserStore = miitoo.get('UserStore');
    var TeamStore = miitoo.get('TeamStore');

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

        if(!password_old || !password_new || !session)
        {
            return;
        }

        // Find the user
        UserStore.findUser(session.id, function(err, user) {
            if(err || !user)
            {
                notDone(spark, 'user:password', err);
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
                            notDone(spark, 'user:password', errSave);
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
        UserStore.findUser(session.id, function(err, user) {
            if(err || !user)
            {
                notDone(spark, 'user:update', err);
                return;
            }

            // Save the user
            user.name = name || user.name;

            user.save(function(err) {
                if(err)
                {
                    notDone(spark, 'user:update', err);
                    return;
                }

                spark.write({
                    event: 'user:update',
                    done:  true,
                    name:  user.name
                });

                primus.in(team._id).write({
                    event: 'team:user:update',
                    id:    session.id,
                    name:  user.name
                });
            });
        });
    });
};
