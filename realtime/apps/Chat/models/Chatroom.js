'use strict';

// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    // The schema of the Chatroom
    var schema = new mongoose.Schema({
        team: String,
        name: String,
        public: {
            type:    Boolean,
            default: true
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

    // The model of the Chatroom
    return mongoose.model('Chatroom', schema);
});

// Register the model
miitoo.register('ChatroomModel', model);