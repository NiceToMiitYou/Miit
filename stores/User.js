'use strict';

// Define the store
var store = miitoo.resolve(['UserModel', 'Mongoose'], function(User, mongoose) {

    var ObjectId = mongoose.Types.ObjectId;

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
        },

        addTeam: function(user, team, cb) {
            var userId = getId(user),
                teamId = getId(team);

            // Prevent crashes
            if(
                !ObjectId.isValid(userId) ||
                !ObjectId.isValid(teamId)
            ) {
                return;
            }

            var conditions = {
                _id: userId
            };

            var update = {
                $addToSet: {
                    teams: teamId
                }
            };

            User.update(conditions, update, function(err) {
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
