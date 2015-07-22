
// Define the store
var store = miitoo.resolve(['SubscriptionModel'], function(Subscription) {
    var mongoose = miitoo.get('Mongoose');

    function getId(object) {
        return object._id || object.id || object;
    }

    // Map subscriptions
    function mapSubscriptions(subscriptions) {
        var subscriptions = subscriptions || [];

        return subscriptions.map(function(subscription) {
            return {
                id:          subscription._id,
                user:        subscription.user,
                team:        subscription.team,
                sender:      subscription.sender,
                application: subscription.application,
                unread:      subscription.unread
            };
        });
    }

    return {
        create: function(application, team, user, sender, cb) {
            var userId   = getId(user);
            var teamId   = getId(team);
            var senderId = getId(sender);

            var subscription = {
                user:        userId,
                team:        teamId,
                sender:      senderId,
                application: application
            };

            Subscription.update(subscription, subscription, { upsert: true }, function(err) {
                if(err) {
                    miitoo.logger.debug(err);
                }

                if(typeof cb === 'function') {
                    cb(err, subscription);
                }
            });
        },

        getSubscriptions: function(team, user, cb) {
            var userId   = getId(user);
            var teamId   = getId(team);

            Subscription.find({
                user: userId,
                team: teamId,
                unread: { $gt: 0 }
            }, {
                alert: false,
                last:  false
            }).exec(function(err, subscriptions) {
                if(err) {
                    miitoo.logger.debug(err);
                }

                if(typeof cb === 'function') {
                    var subs = mapSubscriptions(subscriptions);

                    cb(err, subs);
                }
            });
        },

        getSubscriptionsToSend: function(limit, cb) {
            Subscription.find({
                alert:  false,
                unread: { $gt: 0 }
            })
            .limit(limit)
            .exec(function(err, subscriptions) {
                if(err) {
                    miitoo.logger.debug(err);
                }

                if(typeof cb === 'function') {
                    cb(err, subscriptions);
                }
            });
        },

        increment: function(application, team, user, sender, cb) {
            var teamId   = getId(team);
            var userId   = getId(user);
            var senderId = getId(sender);

            var subscription = {
                team:        teamId,
                user:        { $ne: userId },
                sender:      senderId,
                application: application
            };

            Subscription.update(subscription, {
                alert: false,
                $inc:  { unread: 1 },
                last:  new Date()
            }, { 
                multi: true
            }, function(err) {
                if(err) {
                    miitoo.logger.debug(err);
                }

                if(typeof cb === 'function') {
                    cb(err);
                }
            });
        },

        resetByApplication: function(application, team, user, cb) {
            var teamId   = getId(team);
            var userId   = getId(user);

            var subscription = {
                team:        teamId,
                user:        userId,
                application: application
            };

            Subscription.update(subscription, {
                alert:  false,
                unread: 0
            }, { 
                multi: true
            }, function(err) {
                if(err) {
                    miitoo.logger.debug(err);
                }

                if(typeof cb === 'function') {
                    cb(err);
                }
            });
        },

        resetBySender: function(team, user, sender, cb) {
            var teamId   = getId(team);
            var userId   = getId(user);
            var senderId = getId(sender);

            var subscription = {
                team:   teamId,
                user:   userId,
                sender: senderId
            };

            Subscription.update(subscription, {
                alert:  false,
                unread: 0
            }, { 
                multi: true
            }, function(err) {
                if(err) {
                    miitoo.logger.debug(err);
                }

                if(typeof cb === 'function') {
                    cb(err);
                }
            });
        }
    };
});

// Register the store
miitoo.register('SubscriptionStore', store);
