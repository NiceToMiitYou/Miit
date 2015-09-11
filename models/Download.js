
// Resolve the model dependencies
var model = miitoo.resolve(['Mongoose'], function(mongoose) {

    var ObjectId = mongoose.Schema.Types.ObjectId;

    // The schema of the Upload
    var schema = new mongoose.Schema({
        // Ownership
        application: String,
        team:        String,
        user:        String,
        
        // File reference
        upload: {
            type: ObjectId,
            ref: 'Upload'
        },
        createdAt: {
            type:    Date,
            expires: 600,
            default: Date.now
        }
    });

    // The model of the Download
    return mongoose.model('Download', schema);
});

// Register the model
miitoo.register('DownloadModel', model);
