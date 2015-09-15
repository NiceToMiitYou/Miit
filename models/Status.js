'use strict';

// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    // The schema of the Status
    var schema = new mongoose.Schema({
        teamId: String,
        userId: String,
        status: String,
        changed: {
            type:    Date,
            expires: 120,
            default: Date.now
        }
    });
    
    // The model of the Status
    return mongoose.model('Status', schema);
});

// Register the model
miitoo.register('StatusModel', model);