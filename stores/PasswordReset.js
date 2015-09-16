'use strict';

// Load Utils
var Utils = require('../shared/lib/utils');

// Define the store
var store = miitoo.resolve(['PasswordResetModel', 'Mongoose'], function(PasswordReset, mongoose) {
    var ObjectId = mongoose.Types.ObjectId;

    function getId(object) {
        return String(object._id || object.id || object);
    }

    return {
        create: function(user, cb) {
            var userId = getId(user);

            var conditions = {
                user: userId
            };

            var request = {
                user:  userId,
                token: Utils.generator.guid()
            };

            PasswordReset
                .update(conditions, request, { upsert: true }, function(err) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, request);
                    }
                });
        },

        remove: function(user, requestId, cb) {
            var requestId = getId(request),
                userId    = getId(user);

            // Prevent crashes
            if(!ObjectId.isValid(requestId)) {
                return;
            }

            PasswordReset
                .remove({
                    _id:  requestId,
                    user: userId
                }, function(err) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err);
                    }
                });
        },

        findByToken: function(token, cb) {
            PasswordReset
                .findOne({
                    token: token
                })
                .exec(function(err, request) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, request);
                    }
                });
        }
    };
});

// Register the store
miitoo.register('PasswordResetStore', store);
