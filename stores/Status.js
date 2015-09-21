'use strict';

// Define the store
var store = miitoo.resolve(['StatusModel'], function(Status) {

    function getId(object) {
        return String(object._id || object.id || object);
    }

    function updateStatus(status, user, team, cb) {
        var userId = getId(user),
            teamId = getId(team);

        Status.findOneAndUpdate({
                userId: userId,
                teamId: teamId
            }, {
                status: status,
                userId: userId,
                teamId: teamId,
                changed: new Date()
            }, {
                upsert: true,
                'new':  false
            }, function(err, old) {
                // Log the error
                if(err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }

                if(typeof cb === 'function') {

                    cb(err, {
                        status: status,
                        userId: userId
                    }, (old || {}).status !== status);
                }
            });
    }

    return {
        setUserOnline: function(user, team, cb) {
            updateStatus('ONLINE', user, team, cb);
        },

        setUserOffline: function(user, team, cb) {
            updateStatus('OFFLINE', user, team, cb);
        },

        getStatus: function(team, cb) {
            var teamId = getId(team);

            Status
                .find({
                    teamId: teamId,
                    status: { $ne: 'OFFLINE' }
                }, {
                    _id:    false,
                    userId: true,
                    status: true
                })
                .exec(function(err, status) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, status);
                    }
                });
        },

        getStatusByUserId: function(team, user, cb) {
            var teamId = getId(team);
            var userId = getId(user);

            Status
                .findOne({
                    teamId: teamId,
                    userId: userId
                }, {
                    _id:    false,
                    userId: true,
                    status: true
                })
                .exec(function(err, status) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, status);
                    }
                });
        }
    };
});

// Register the store
miitoo.register('StatusStore', store);
