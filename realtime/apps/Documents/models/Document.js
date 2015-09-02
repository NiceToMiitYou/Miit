'use strict';

// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {
    var ObjectId = mongoose.Schema.Types.ObjectId;

    // The schema of the Document
    var schema = new mongoose.Schema({
        team: String,
        public: {
            type:    Boolean,
            default: true
        },
        file: {
            type:     ObjectId,
            ref:      'Upload',
            required: true
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
            return ret;
        }
    };

    // The model of the Document
    return mongoose.model('Document', schema);
});

// Register the model
miitoo.register('DocumentModel', model);