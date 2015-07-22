'use strict';

module.exports = function SubscriptionManager() {
    var SubscriptionStore = miitoo.get('SubscriptionStore');
    
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    // Handle get informations of subscriptions
    Dispatcher.register('subscription:list', 'USER', function onGetList(spark, data, team, user) {
        // Get the list of subscriptions (with unread)
        SubscriptionStore.getSubscriptions(team, user, function(err, subscriptions) {
            if(err) {
                return;
            }

            spark.write({
                event:         'subscription:list',
                subscriptions: subscriptions
            });
        });
    });

    // Set read an application
    Dispatcher.register('subscription:application:read', 'USER', function onApplicationRead(spark, data, team, user) {
        var application = data.application;

        if(!application) {
            return;
        }

        SubscriptionStore.resetByApplication(application, team, user);
    });

    // Set read a sender
    Dispatcher.register('subscription:sender:read', 'USER', function onSenderRead(spark, data, team, user) {
        var sender = data.sender;

        if(!sender) {
            return;
        }

        SubscriptionStore.resetBySender(team, user, sender);
    });
};
