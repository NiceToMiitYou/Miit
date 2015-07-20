
// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    // The schema of the Subscription
    var schema = new mongoose.Schema({
        team:        String,
        user:        String,
        sender:      String,
        application: String,
        alert: {
            type:    Boolean,
            default: false
        },
        unread: {
            type:    Number,
            default: 0
        },
        last: {
            type:    Date,
            default: Date.now
        }
    });

    // The model of the Subscription
    return mongoose.model('Subscription', schema);
});

// Register the model
miitoo.register('SubscriptionModel', model);