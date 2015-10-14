'use strict';

// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {
    var ObjectId = mongoose.Schema.Types.ObjectId;

    // The schema of the Quiz
    var schema = new mongoose.Schema({
        team: {
            type:     String,
            required: true
        },
        name: {
            type:     String,
            required: true
        },
        description: String,
        file: {
            type:     ObjectId,
            ref:      'Upload',
            required: true
        },
        slides: [{
            slide: {
                type:    Number,
                default: 0
            },
            comment: {
                type: String
            }
        }],
        current: {
            type:    Number,
            default: 0
        },
        public: {
            type:    Boolean,
            default: true
        },
        converted: {
            type:    Boolean,
            default: false
        },
        closed: {
            type:    Boolean,
            default: false
        },
        published: {
            type:    Boolean,
            default: false
        },
        createdAt: {
            type:    Date,
            default: Date.now
        }
    });

    /**
     * toJSON implementation
     */
    schema.options.toJSON = {
        transform: function(doc, ret, options) {
            ret.id = ret._id;

            for(var i in ret.slides) {

                // Swap _id to id
                ret.slides[i].id = ret.slides[i]._id;

                delete ret.slides[i]._id;
            }

            delete ret._id;
            delete ret.__v;
            return ret;
        }
    };
    
    // The model of the Quiz
    return mongoose.model('Presentation', schema);
});

// Register the model
miitoo.register('PresentationModel', model);