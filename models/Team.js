
// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    var ObjectId = mongoose.Schema.Types.ObjectId;

    // The schema of the Team
    var schema = new mongoose.Schema({
        slug: {
            type:   String,
            unique: true
        },
        public: { 
            type:    Boolean,
            default: false
        },
        users: [{
            user: { 
                type: ObjectId,
                ref: 'User'
            },
            roles: [String]
        }],
        locked: {
            type: Boolean,
            default: false
        },
        name:         String,
        applications: [String]
    });

    /**
     * toJSON implementation
     */
    schema.options.toJSON = {
        transform: function(doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.users;
            return ret;
        }
    };

    // The model of the Team
    return mongoose.model('Team', schema);
});

// Register the model
miitoo.register('TeamModel', model);