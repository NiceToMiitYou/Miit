
// Define the store
var store = miitoo.resolve(['UploadModel', 'Mongoose'], function(Upload, mongoose) {
    var ObjectId = mongoose.Types.ObjectId;

    function getId(object) {
        return object._id || object.id || object;
    }

    return {
        create: function(team, user, application, cb) {
            var teamId = getId(team),
                userId = getId(user);

            var upload = new Upload({
                user:        userId,
                team:        teamId,
                application: application
            });

            upload.save(function(err) {
                if(err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }

                if(typeof cb === 'function') {
                    cb(err, upload);
                }
            });
        },

        getNotUploaded: function(upload, team, user, application, cb) {
            var teamId   = getId(team),
                userId   = getId(user),
                uploadId = new ObjectId(getId(upload));

            Upload
                .findOne({
                    _id:         uploadId,
                    user:        userId,
                    team:        teamId,
                    application: application,
                    uploaded: false
                })
                .exec(function(err, upload) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, upload);
                    }
                });
        },

        getUploaded: function(upload, team, user, application, cb) {
            var teamId   = getId(team),
                userId   = getId(user),
                uploadId = new ObjectId(getId(upload));

            Upload
                .findOne({
                    _id:         uploadId,
                    user:        userId,
                    team:        teamId,
                    application: application,
                    uploaded: true
                })
                .exec(function(err, upload) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, upload);
                    }
                });
        },

        setUploaded: function(upload, path, name, size, type, cb) {
            var uploadId = new ObjectId(getId(upload));

            Upload
                .update({
                    _id: uploadId
                }, {
                    path:     path,
                    name:     name,
                    size:     size,
                    type:     type,
                    uploaded: true
                }, function(err, upload) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, upload);
                    }
                });
        },

        remove: function(upload, cb) {
            var uploadId = new ObjectId(getId(upload));

            Upload
                .remove({
                    _id: uploadId
                }, function(err) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err);
                    }
                });
        }
    };
});

// Register the store
miitoo.register('UploadStore', store);