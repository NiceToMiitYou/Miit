
// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    // The schema of the Chatroom
    var schema = new mongoose.Schema({
        team: String,
        name: String,
        public: {
            type:    Boolean,
            default: true
        },
        messages: [{
            user: String,
            text: String,
            createdAt: {
                type:    Date,
                default: Date.now
            }
        }]
    });

    // The model of the Chatroom
    return mongoose.model('Chatroom', schema);
});

// Register the model
miitoo.register('ChatroomModel', model);