'use strict';

// Load Utils
var Utils = require('../shared/lib/utils');

// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    var ObjectId = mongoose.Schema.Types.ObjectId;

    // The schema of the Upload
    var schema = new mongoose.Schema({
        team:  String,
        email: String,
        token: {
            type:    String,
            default: Utils.generator.guid
        },

        roles: {
            type:    [String],
            default: ['USER']
        },
        
        send: {
            type:    Boolean,
            default: false
        },
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
            delete ret.send;
            delete ret.createdAt;
            return ret;
        }
    };

    // The model of the Invitation
    return mongoose.model('Invitation', schema);
});

// Register the model
miitoo.register('InvitationModel', model);
