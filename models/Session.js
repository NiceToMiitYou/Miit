'use strict';

// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    var ObjectId = mongoose.Schema.Types.ObjectId;

    // The schema of the Upload
    var schema = new mongoose.Schema({
        // Ownership
        team: String,
        user: String,
        hour: Date,

        // Informations about
        pings: [Date]
    });

    // The model of the Upload
    return mongoose.model('Session', schema);
});

// Register the model
miitoo.register('SessionModel', model);
