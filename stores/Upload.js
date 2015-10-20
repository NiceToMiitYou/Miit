'use strict';

// Define the store
var store = miitoo.resolve(['DownloadModel', 'UploadModel', 'Mongoose'], function(Download, Upload, mongoose) {
    var ObjectId = mongoose.Types.ObjectId;

    function getId(object) {
        return String(object._id || object.id || object);
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

        allow: function(upload, user, team, application, cb) {
            var teamId   = getId(team),
                userId   = getId(user),
                uploadId = getId(upload);

                var download = new Download({
                    application: application,
                    team:        teamId,
                    user:        userId,
                    upload:      uploadId
                });

                download.save(function(err, upload) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, download);
                    }
                });
        },

        getNotUploaded: function(upload, team, user, application, cb) {
            var teamId   = getId(team),
                userId   = getId(user),
                uploadId = getId(upload);

            // Prevent crashes
            if(!ObjectId.isValid(uploadId)) {
                return;
            }

            Upload
                .findOne({
                    _id:         uploadId,
                    user:        userId,
                    team:        teamId,
                    application: application,
                    uploaded:    false,
                    deleted:     false
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
                uploadId = getId(upload);

            // Prevent crashes
            if(!ObjectId.isValid(uploadId)) {
                return;
            }

            Upload
                .findOne({
                    _id:         uploadId,
                    user:        userId,
                    team:        teamId,
                    application: application,
                    uploaded:    true,
                    deleted:     false
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

        getForDownload: function(download, upload, user, team, application, cb) {
            var teamId     = getId(team),
                userId     = getId(user),
                downloadId = getId(download),
                uploadId   = getId(upload);

            // Prevent crashes
            if(
                !ObjectId.isValid(downloadId) ||
                !ObjectId.isValid(uploadId)
            ) {
                return;
            }

            Download
                .findOne({
                    _id:         downloadId,
                    application: application,
                    team:        teamId,
                    user:        userId
                })
                .populate({
                    path: 'upload',
                    match: {
                        _id:      uploadId,
                        uploaded: true,
                        deleted:  false
                    }
                })
                .exec(function(err, download) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, download);
                    }
                });
        },

        setUploaded: function(upload, path, name, size, type, cb) {
            var uploadId = getId(upload);

            // Prevent crashes
            if(!ObjectId.isValid(uploadId)) {
                return;
            }

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

        setRemoved: function(upload, cb) {
            var uploadId = getId(upload);

            // Prevent crashes
            if(!ObjectId.isValid(uploadId)) {
                return;
            }

            Upload
                .update({
                    _id: uploadId
                }, {
                    removed: true
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

        incrementDownloads: function(upload, cb) {
            var uploadId = getId(upload);

            // Prevent crashes
            if(!ObjectId.isValid(uploadId)) {
                return;
            }

            Upload
                .update({
                    _id: uploadId
                }, {
                    $inc:  { downloads: 1 }
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
            var uploadId = getId(upload);

            // Prevent crashes
            if(!ObjectId.isValid(uploadId)) {
                return;
            }

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
