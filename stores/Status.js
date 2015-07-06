
// Define the store
var store = miitoo.resolve(['StatusModel'], function(Status) {

    function updateStatus(status, user, team, cb)  {
        Status.findOneAndUpdate({
                userId: user._id || user.id || '',
                teamId: team._id || team.id || ''
            }, {
                status: status,
                userId: user._id || user.id || '',
                teamId: team._id || team.id || '',
                changed: new Date()
            }, {
                upsert: true,
                "new": false
            }, function(err, old) {
                // Log the error
                if(err) {
                    miitoo.logger.error(err);
                }

                if(typeof cb === 'function') {
                    cb(err, {
                        status: status,
                        userId: user._id || user.id || ''
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
            Status
                .find({
                    teamId: team._id,
                    status: { $ne: 'OFFLINE' }
                }, {
                    _id:    false,
                    userId: true,
                    status: true
                })
                .exec(function(err, status) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err);
                    }

                    if(typeof cb === 'function') {
                        cb(err, status);
                    }
                });
        },

        getStatusByUserId: function(team, userId, cb) {
            Status
                .findOne({
                    teamId: team._id,
                    userId: userId
                }, {
                    _id:    false,
                    userId: true,
                    status: true
                })
                .exec(function(err, status) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err);
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
