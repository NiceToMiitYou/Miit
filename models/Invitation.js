'use strict';

// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    var ObjectId = mongoose.Schema.Types.ObjectId;

    // The schema of the Upload
    var schema = new mongoose.Schema({
        team:  String,
        email: String,
        token: String,

        roles: {
            type:    [String],
            default: ['USER']
        },
        
        // An invitation stay alive for 7 days
        createdAt: {
            type:    Date,
            expires: 604800,
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
            delete ret.team;
            delete ret.createdAt;
            return ret;
        }
    };

    // The model of the Invitation
    return mongoose.model('Invitation', schema);
});

// Register the model
miitoo.register('InvitationModel', model);
