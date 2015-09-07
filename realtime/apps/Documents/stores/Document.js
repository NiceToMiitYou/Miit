'use strict';

// Define the store
var store = miitoo.resolve(['DocumentModel', 'Mongoose'], function(Document, mongoose) {
    var ObjectId = mongoose.Types.ObjectId;

    function getId(object) {
        return object._id || object.id || object;
    }

    // Shortcut for update
    function updateDocument(conditions, update, cb) {
        Document.update(conditions, update, function(err, doc) {
            // Log the error
            if(err) {
                miitoo.logger.error(err.message);
                miitoo.logger.error(err.stack);
            }

            if(typeof cb === 'function') {
                cb(err, doc);
            }
        });
    }

    return {
        create: function(team, upload, cb) {
            var teamId = getId(team);

            var document = new Document({
                team: teamId,
                file: upload
            });

            document.save(function(err) {
                if(err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }

                if(typeof cb === 'function') {
                    cb(err, document);
                }
            });
        },

        findDocuments: function(team, options, cb) {
            var teamId = getId(team);

            var conditions = {
                team: teamId
            };

            if(true !== options.private) {
                conditions['public'] = true;
            }

            Document
                .find(conditions)
                .populate('file')
                .exec(function(err, documents) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, documents);
                    }
                });
        },

        remove: function(team, document, cb) {
            var teamId     = getId(team),
                documentId = getId(document);

            // Prevent crashes
            if(!ObjectId.isValid(documentId)) {
                return;
            }

            Document
                .findOne(new ObjectId(documentId))
                .populate('file')
                .exec(function(err, doc) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(!doc) {
                        return;
                    }

                    var upload = doc.file;

                    Document
                        .remove({
                            _id:  documentId,
                            team: teamId
                        }, function(err) {
                            if(err) {
                                miitoo.logger.error(err.message);
                                miitoo.logger.error(err.stack);
                            }

                            upload.deleted = true;
                            upload.save();

                            if(typeof cb === 'function') {
                                cb(err);
                            }
                        });
                });
        }
    };
});

// Register the store
miitoo.register('DocumentStore', store);
