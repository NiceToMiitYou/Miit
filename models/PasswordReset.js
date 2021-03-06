'use strict';

// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    var ObjectId = mongoose.Schema.Types.ObjectId;

    // The schema of the Upload
    var schema = new mongoose.Schema({
        // Ownership
        user:  String,
        token: String,

        // A password request stay alive for 24 hours
        createdAt: {
            type:    Date,
            expires: 86400,
            default: Date.now
        }
    });

    /**
     * toJSON implementation
     */
    schema.options.toJSON = {
        transform: function(doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.user;
            delete ret.createdAt;
            return ret;
        }
    };

    // The model of the Upload
    return mongoose.model('PasswordReset', schema);
});

// Register the model
miitoo.register('PasswordResetModel', model);
