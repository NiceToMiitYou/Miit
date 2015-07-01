'use strict';

var crypto = require('crypto');

function sha1(input) {
    // Create ShaSum
    var shasum = crypto.createHash('sha1');

    // Add the content of shasum
    shasum.update(input);

    // Return the value
    return shasum.digest('hex');
}

function generateId() {
    var id = 'ANONYM_';

    // Loop for password length
    for(var i = 0; i <= 2; i++) {
        id += Math.random().toString(36).slice(-8);
    }

    return id;
}

module.exports = function UserManager() {
    var UserStore = miitoo.get('UserStore');
    var TeamStore = miitoo.get('TeamStore');
    
    var jwt        = miitoo.get('Jwt');
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    // Function if this is the wrong login
    function wrongLogin(spark) {
        spark.write({
            event: 'login:password',
            done:  false
        });
    }

    // Function if this is the rigth login
    function rigthLogin(spark, team, user, email) {
        var token = jwt.sign({
            user:  user.id,
            team:  team.id,
            email: email
        });

        spark.write({
            event: 'login:password',
            done:  true,
            token: token,
            user:  user
        });
    }

    Dispatcher.register('login:password', 'ANONYM', function onLoginUser(spark, data, team) {
        var email    = data.email;
        var password = data.password;

        if(!email || !password)
        {
            return wrongLogin(spark);
        }

        // Retrieve the user
        UserStore.findUserByEmail(email, function(err, user) {
            if(err || !user)
            {
                wrongLogin(spark);
            }
            else
            {
                // Check the password
                user.validPassword(password, function(result) {
                    if(true === result) {
                        // Find session in team (with roles)
                        TeamStore.findUser(team, user, function(errUser, session) {
                            // MISSING USER BUT NOT IN TEAM?
                            if(!session) {
                                return wrongLogin(spark);
                            }

                            // Register the email
                            spark.request.user  = session;
                            spark.request.roles = session.roles;
                            spark.request.email = email;

                            // Send login token
                            rigthLogin(spark, team, session, email);
                        });
                    }
                    else
                    {
                        wrongLogin(spark);
                    }
                });
            }
        });
    });

    Dispatcher.register('login:token', 'ANONYM', function onTokenUser(spark, data, team) {
        var token = data.token;

        jwt.verify(token, function(err, payload) {
            if(!err) {
                var userId = payload.user;

                TeamStore.findUser(team, userId, function(errUser, session) {
                    if(!errUser && session) {
                        spark.request.user  = session;
                        spark.request.roles = session.roles;

                        spark.write({
                            event: 'login:token',
                            user:  session,
                            token: token
                        });
                    }
                    else
                    {
                        miitoo.logger.error(errUser || new Error('No user found with JWT.'));
                    }
                });
            }
            else
            {
                miitoo.logger.error(err);
            }
        });
    });

    function handleSession(spark, id, token) {
        // Instanciate the session
        var session = {
            id:     id,
            _id:    id,
            avatar: sha1(id),
            roles:  ['ANONYM']
        };

        // Store informations
        spark.request.user  = session;
        spark.request.roles = session.roles;
        
        // Send it to the user
        spark.write({
            event: 'login:anonym',
            user:  session,
            token: token
        });
    }

    Dispatcher.register('login:anonym', 'ANONYM', function onTokenUser(spark, data, team) {
        
        // if there is no token
        if(!data.token) {
            var id = generateId();

            var token = jwt.sign({
                user: id
            });

            handleSession(spark, id, token);
        }
        else
        {
            jwt.verify(data.token, function(err, payload) {
                if(err)
                {
                    miitoo.logger.error(err);
                    return;
                }
                
                handleSession(spark, payload.user, data.token);
            });
        }
    });
};
