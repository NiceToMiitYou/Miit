
// Define the store
var store = miitoo.resolve(['UserModel'], function(User) {

    return {
        findUser: function(user, cb) {
            User
                .findOne({
                    _id: user._id || user
                })
                .exec(function(err, user) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err);
                    }

                    if(typeof cb === 'function') {
                        cb(err, user);
                    }
                });
        },

        findUserByEmail: function(email, cb) {
            User
                .findOne({
                    email: email
                })
                .exec(function(err, user) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err);
                    }

                    if(typeof cb === 'function') {
                        cb(err, user);
                    }
                });
        }
    };
});

// Register the store
miitoo.register('UserStore', store);
