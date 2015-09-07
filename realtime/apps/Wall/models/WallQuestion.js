'use strict';

// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {
    var ObjectId = mongoose.Schema.Types.ObjectId;

    // The schema of the Document
    var schema = new mongoose.Schema({
        team: String,
        user: String,
        answered: {
            type:    Boolean,
            default: false
        },
        allowComments: {
            type:    Boolean,
            default: true
        },
        text: {
            type:     String,
            required: true
        },
        likes: {
            type:    [String],
            default: []
        },
        public: {
            type:    Boolean,
            default: true
        },
        createdAt: {
            type:    Date,
            default: Date.now
        },
        comments: [{
            user: String,
            text: String,
            answer: {
                type:    Boolean,
                default: false
            },
            createdAt: {
                type:    Date,
                default: Date.now
            }
        }]
    });

    // Validate the login
    schema.methods.isLiked = function(userId) {
        return -1 !== this.likes.indexOf(userId);
    };

    /**
     * toJSON implementation
     */
    schema.options.toJSON = {
        transform: function(doc, ret, options) {
            ret.id    = ret._id;
            ret.likes = ret.likes.length;

            for(var index in ret.comments) {
                ret.comments[index].id = ret.comments[index]._id;
                delete ret.comments[index]._id;
            }

            delete ret._id;
            delete ret.__v;
            delete ret.team;
            return ret;
        }
    };

    // The model of the WallQuestion
    return mongoose.model('WallQuestion', schema);
});

// Register the model
miitoo.register('WallQuestionModel', model);