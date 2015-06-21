'use strict';

module.exports = function UserManager() {
    var UserStore = miitoo.get('UserStore');
    var TeamStore = miitoo.get('TeamStore');
    
    var jwt    = miitoo.get('Jwt');
    var primus = miitoo.get('Primus');
    
    function onLoginUser(spark, team) {

        // Function if this is the wrong login
        function wrongLogin() {
            spark.write({
                event: 'login:password',
                done:  false
            });
        }

        // Function if this is the rigth login
        function rigthLogin(user, email) {
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

        spark.on('login:password', function(data) {
            var email    = data.email;
            var password = data.password;

            if(!email || !password)
            {
                return wrongLogin();
            }

            // Retrieve the user
            UserStore.findUserByEmail(email, function(err, user) {
                if(err || !user)
                {
                    wrongLogin();
                }
                else
                {
                    // Check the password
                    user.validPassword(password, function(result) {
                        if(true === result) {
                            // Find session in team (with roles)
                            TeamStore.findUser(team, user, function(errUser, session) {
                                // MISSING USER BUT NOT IN TEAM?

                                // Register the email
                                spark.request.user  = user;
                                spark.request.roles = session.roles;
                                spark.request.email = email;

                                // Send login token
                                rigthLogin(session, email);
                            });
                        }
                        else
                        {
                            wrongLogin();
                        }
                    });
                }
            });
        });
    }

    function onTokenUser(spark, team) {
        spark.on('login:token', function(data) {
            var token = data.token;

            jwt.verify(token, function(err, payload) {
                if(!err) {
                    var userId = payload.user;

                    TeamStore.findUser(team, userId, function(errUser, user) {
                        if(!errUser) {
                            spark.request.user = user;

                            spark.write({
                                event: 'login:token',
                                user:  user,
                                token: token
                            });
                        }
                        else
                        {
                            miitoo.logger.error(errUser);
                        }
                    });
                }
                else
                {
                    miitoo.logger.error(err);
                }
            });
        });
    }

    // On user connection
    primus.on('connection', function(spark) {
        var team   = spark.request.team;

        // Handle the login of user
        onLoginUser(spark, team);

        // Handle the token of user
        onTokenUser(spark, team);
    });
};
