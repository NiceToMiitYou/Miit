
// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    // The schema of the Quiz
    var schema = new mongoose.Schema({
        team: {
            type:     String,
            required: true
        },
        user: {
            type:     String,
            required: true
        },
        name: {
            type:     String,
            required: true
        },
        description: String,
        duration:    Number,
        start:       Date,
        end:         Date,
        public: {
            type:    Boolean,
            default: true
        },
        createdAt: {
            type:    Date,
            default: Date.now
        },
        // Questions model
        questions: [{
            title: {
                type:     String,
                required: true
            },
            subtitle: String,
            type:     Number,
            group:    String,
            required: {
                type:    Boolean,
                default: true
            },
            // Answers model
            answers: [{
                title: String,
                type:  Number,
                // Choices model
                choices: [{
                    userId: {
                        type:     String,
                        required: true
                    },
                    extra: [{
                        key:   String,
                        value: String
                    }]
                }]
            }]
        }]
    });
    
    // The model of the Quiz
    return mongoose.model('Quiz', schema);
});

// Register the model
miitoo.register('QuizModel', model);