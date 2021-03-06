'use strict';

var MAX_TIMESTAMP = 8640000000000000;

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
        icon:        String,
        answers: {
            type:    [String],
            default: []
        },
        start: {
            type:    Date,
            default: Date.now
        },
        end: {
            type:    Date,
            default: function() {
                return new Date(MAX_TIMESTAMP); 
            }
        },
        public: {
            type:    Boolean,
            default: true
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
        },
        // Questions model
        questions: [{
            title: {
                type:     String,
                required: true
            },
            subtitle: String,
            kind:     Number,
            order:    Number,
            group:    String,
            required: {
                type:    Boolean,
                default: true
            },
            // Answers model
            answers: [{
                title: String,
                kind:  Number,
                order: Number,
                // Choices model
                choices: [{
                    user: {
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

    /**
     * toJSON implementation
     */
    schema.options.toJSON = {
        transform: function(doc, ret, options) {
            ret.id = ret._id;

            for(var i in ret.questions) {

                // Do the same to answers
                for(var j in ret.questions[i].answers) {
                    // Swap _id to id
                    ret.questions[i].answers[j].id = ret.questions[i].answers[j]._id;

                    delete ret.questions[i].answers[j]._id;
                }

                // Swap _id to id
                ret.questions[i].id = ret.questions[i]._id;

                delete ret.questions[i]._id;
            }
            
            ret.answers = ret.answers.length;

            delete ret._id;
            delete ret.__v;
            return ret;
        }
    };
    
    // The model of the Quiz
    return mongoose.model('Quiz', schema);
});

// Register the model
miitoo.register('QuizModel', model);