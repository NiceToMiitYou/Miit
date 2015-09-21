'use strict';

// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    var ObjectId = mongoose.Schema.Types.ObjectId;

    // The schema of the Chatroom
    var schema = new mongoose.Schema({
        user: String,
        text: String,
        chatroom: {
            type: ObjectId,
            ref: 'Chatroom'
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
            delete ret._id;
            delete ret.__v;
            delete ret.chatroom;
            return ret;
        }
    };

    // The model of the Chatroom
    return mongoose.model('Chatmessage', schema);
});

// Register the model
miitoo.register('ChatmessageModel', model);