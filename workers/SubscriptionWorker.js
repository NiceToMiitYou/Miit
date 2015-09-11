
var timeoutId, primus, SubscriptionStore;

// Variables for waiting
var currentWait = 5000;
var minWait     = 100,
    maxWait     = 40000;

// Max requested status
var maxSubscriptions = 50;

// Function to redefine waiting time
function recalculateTime(done) {
    var newTime = currentWait;

    var value = maxSubscriptions / 2;
    var coef  = (value - done) / value;

    newTime += newTime * coef;

    // Set the new wait time
    currentWait = (newTime > maxWait) ? maxWait : // If superior to maxtime
                  (newTime < minWait) ? minWait : // If inferior to mintime
                                        Math.round(newTime);
}

function endOfWorker(subscriptionsDone) {
    miitoo.logger.info('End of SubscriptionWorker.');

    // Recalculate waiting time
    recalculateTime(subscriptionsDone);

    miitoo.logger.debug('Notification send:', subscriptionsDone, 'Next check in:', currentWait + 'ms');

    // restart the worker after 5sec
    timeoutId = setTimeout(SubscriptionWorker, currentWait);
}

// The worker
function SubscriptionWorker() {
    miitoo.logger.info('Running SubscriptionWorker...');

    var subscriptionsDone = 0;

    SubscriptionStore.getSubscriptionsToSend(maxSubscriptions, function(err, subscriptions) {
        if(err) {
            return;
        }

        subscriptions.forEach(function(subscription) {
            var team = subscription.team;
            var user = subscription.user;
            var room = team + ':' + user;

            // Notify the user
            primus.in(room).write({
                event: 'subscription:new'
            });

            // Update the subscription
            subscription.alert = true;
            subscription.save();

            subscriptionsDone++;
        });

        endOfWorker(subscriptionsDone);
    });

}

// Start worker after initialisation
miitoo.once('after:start', function() {    

    // Load primus
    primus = miitoo.get('Primus');

    // Load the store
    SubscriptionStore = miitoo.get('SubscriptionStore');

    // Run one time the worker
    timeoutId = setTimeout(SubscriptionWorker, currentWait);
});

// Stop worker before stop
miitoo.once('before:stop', function() {    

    // Stop the worker
    clearTimeout(timeoutId);

    miitoo.logger.info('SubscriptionWorker Stopped.');
});