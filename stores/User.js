
// Define the store
var store = miitoo.resolve(['UserModel'], function(User) {

    function getId(object) {
        return String(object._id || object.id || object);
    }

    return {
        findUser: function(user, cb) {
            var userId = getId(user);

            User
                .findOne({
                    _id: userId
                })
                .exec(function(err, user) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
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
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
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
