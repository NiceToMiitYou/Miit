'use strict';

// Define the store
var store = miitoo.resolve(['SessionModel', 'Mongoose'], function(Session, mongoose) {

    function getId(object) {
        return String(object._id || object.id || object);
    }

    function getHour(lastMinute) {
        var today = new Date();
        
        if(true === lastMinute) {
            today.setMinutes(today.getMinutes() - 1);
        }

        // Reset hours
        today.setHours(0, 0, 0, 0);
        

        return today;
    }

    function getNow(lastMinute) {
        var now = new Date();
        
        if(true === lastMinute) {
            now.setMinutes(now.getMinutes() - 1);
        }

        // Round seconds
        now.setSeconds(0, 0);
        
        return now;
    }

    return {
        log: function(team, user, cb) {
            var teamId = getId(team),
                userId = getId(user);

            // Get variables
            var hour = getHour(),
                now  = getNow();

            var conditions = {
                user: userId,
                team: teamId,
                hour: hour
            };

            var update = {
                user: userId,
                team: teamId,
                hour: hour,
                $addToSet: {
                    pings: now
                }
            };

            Session.update(conditions, update, {
                    upsert: true
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

        getActive: function(team, cb) {
            var teamId = getId(team);

            // Get variables
            var hour = getHour(true),
                now  = getNow(true);

            var conditions = {
                team: teamId,
                hour: hour,
                pings: {
                    $elemMatch: {
                        $eq: now
                    }
                }
            };

            Session.count(conditions, function(err, count) {
                // Log the error
                if(err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }

                if(typeof cb === 'function') {
                    cb(err, count);
                }
            });
        }
    };
});

// Register the store
miitoo.register('SessionStore', store);
