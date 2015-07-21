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
    var id = '';

    // Loop for password length
    for(var i = 0; i <= 2; i++) {
        id += Math.random().toString(36).slice(-8);
    }

    return 'ANONYM_' + sha1(id);
}

module.exports = function LoginManager() {
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
    function rigthLogin(spark, event, team, user, email) {
        // Dispatch a disconnection event
        Dispatcher.dispatch(spark, 'disconnection', {}, true);

        var token = jwt.sign({
            user:  user.id,
            team:  team.id,
            email: email
        });

        // Register the email
        spark.request.user  = user;
        spark.request.roles = user.roles;

        // Get apps
        var apps = team.applications || [];

        // Add the user in the team channel and is own channel
        spark.join(team.id);
        spark.join(team.id + ':' + user.id);

        // Join rooms of apps
        apps.forEach(function(app) {
            // Join the app room
            spark.join(team._id + ':' + app.identifier);
        });

        spark.write({
            event: event,
            done:  true,
            token: token,
            user:  user
        });

        // Dispatch a ping
        Dispatcher.dispatch(spark, 'incoming::ping', {}, true);
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

                            // Send login token
                            rigthLogin(spark, 'login:password', team, session, email);
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
        if(!data.token || data.token == "null") {
            return;
        }

        jwt.verify(data.token, function(err, payload) {
            if(!err) {
                var userId = payload.user;

                TeamStore.findUser(team, userId, function(errUser, session) {
                    if(!errUser && session) {
                        // Send login token
                        rigthLogin(spark, 'login:token', team, session, session.email);
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

    function rigthAnonymLogin(spark, id, token, team) {
        // Dispatch a disconnection event
        Dispatcher.dispatch(spark, 'disconnection', {}, true);

        // Instanciate the session
        var session = {
            id:     id,
            _id:    id,
            avatar: id.replace('ANONYM_', ''),
            roles:  ['ANONYM']
        };

        // Store informations
        spark.request.user  = session;
        spark.request.roles = session.roles;
    
        // Subscribes to rooms
        if(true === team.public) {
            // Get apps
            var apps = team.applications || [];

            // Add the user in the team channel and is own channel
            spark.join(team.id);
            spark.join(team.id + ':' + id);

            // Join rooms of apps
            apps.forEach(function(app) {

                if(false === app.public) {
                    // Join the app room
                    spark.join(team._id + ':' + app.identifier);
                }
            });
        }

        // Send it to the user
        spark.write({
            event: 'login:anonym',
            user:  session,
            token: token
        });

        // Dispatch a ping
        Dispatcher.dispatch(spark, 'incoming::ping', {}, true);
    }

    Dispatcher.register('login:anonym', 'ANONYM', function onTokenUser(spark, data, team) {
        
        // if there is no token
        if(!data.token || data.token == "null") {
            var id = generateId();

            var token = jwt.sign({
                user: id
            });

            rigthAnonymLogin(spark, id, token, team);
        }
        else
        {
            jwt.verify(data.token, function(err, payload) {
                if(err)
                {
                    miitoo.logger.error(err);
                    return;
                }
                
                rigthAnonymLogin(spark, payload.user, data.token, team);
            });
        }
    });
};
