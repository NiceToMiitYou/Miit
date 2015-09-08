
var Utils = require('../shared/lib/utils');

// Define the manager
var manager = miitoo.resolve(
    ['UserStore', 'UserModel', 'MailManager'],
    function(UserStore, User, MailManager) {

    function upperLettersRandomly(str) {
        var limit = Math.round(str.length / 2);

        for(var i = 0; i < limit; i++) {
            // Random letter to uppercase
            var pos    = Math.floor(Math.random() * str.length),
                letter = str.charAt(pos).toUpperCase();

            str = str.slice(0, pos) + letter + str.slice(pos + 1);
        }

        return str;
    }

    function generatePassword() {
        var password = '';

        // Loop for password length
        for(var i = 0; i < 1; i++) {
            var str   = Math.random().toString(36).slice(-10);
            password += upperLettersRandomly(str);
        }

        // If wrong password regenerate
        if(false === Utils.validator.password(password)) {
            return generatePassword();
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
                    var password = generatePassword();

                    // Create the user
                    user = new User({
                        email:    email,
                        password: password
                    });

                    // save it
                    user.save(function(errUser) {
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
                    // Callback
                    cb(null, user);
                }
            });
        }
    };
});

// Register the manager
miitoo.register('UserManager', manager);
