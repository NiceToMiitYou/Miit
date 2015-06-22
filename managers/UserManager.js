
// Define the manager
var manager = miitoo.resolve(
    ['UserStore', 'UserModel'],
    function(UserStore, User) {

    function generatePassword() {
        var password = '';

        // Loop for password length
        for(var i = 0; i <= 1; i++) {
            password += Math.random().toString(36).slice(-8);
        }

        return password;
    }

    return {
        findUserByEmailOrCreate: function(email, cb) {

            if(!email) {
                return cb(new Error('No email provided.'));
            }

            // Find or create an user by email
            UserStore.findUserByEmail(email, function(err, user) {
                if(err) {
                    return cb(err);
                }

                if(!user) {
                    // Create the user
                    user = new User({
                        email:    email,
                        password: generatePassword()
                    });

                    // Log the user informations
                    miitoo.logger.debug(user);

                    // save it
                    user.save(function(errUser) {
                        if(errUser) {
                            return cb(errUser);
                        }

                        // Callback
                        cb(null, user);
                    });
                }
                else
                {
                    // Callback
                    cb(null, user);
                }
            });
        }
    };
});

// Register the manager
miitoo.register('UserManager', manager);
