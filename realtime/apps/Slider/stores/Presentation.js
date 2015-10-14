'use strict';

// Define the store
var store = miitoo.resolve(['PresentationModel', 'Mongoose'], function(Presentation, mongoose) {
    var ObjectId = mongoose.Types.ObjectId;

    function getId(object) {
        return String(object._id || object.id || object);
    }

    // Shortcut for update
    function updatePresentation(conditions, update, cb) {
        Presentation.update(conditions, update, function(err, doc) {
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

    function updateConditions(conditions, options) {
        var userId = (options || {});

        if(!options) {
            return;
        }

        if(true !== options.private) {
            conditions['public'] = true;

            console.log('Request public presentations.');
        }

        if(true !== options.converted) {
            conditions['converted'] = true;

            console.log('Request converted presentations.');
        }

        if(true !== options.unpublished) {
            conditions['published'] = true;

            console.log('Request published presentations.');
        }

        if(true !== options.closed) {
            conditions['closed'] = false;
            //conditions['start']  = { $gte: Date.now() };
            //conditions['end']    = { $lte: Date.now() };

            console.log('Request opened presentations.');
        }
    }

    return {
        findPresentation: function(team, presentation, options, cb) {
            var teamId         = getId(team),
                presentationId = getId(presentation);

            // Prevent crashes
            if(!ObjectId.isValid(presentationId)) {
                return;
            }

            if(typeof options === 'function') {
                cb      = options;
                options = null;
            }

            var conditions = {
                _id:  presentationId,
                team: teamId
            };

            // define specific conditions
            updateConditions(conditions, options);

            Presentation
                .findOne(conditions)
                .exec(function(err, presentation) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, presentation);
                    }
                });
        },

        findNotConvertedPresentation: function(cb) {
            var conditions = {
                converted: false
            };

            Presentation
                .findOne(conditions)
                .populate('file')
                .exec(function(err, presentation) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, presentation);
                    }
                });
        },

        findPresentations: function(team, options, cb) {
            var teamId = getId(team);

            var conditions = {
                team: teamId
            };

            // define specific conditions
            updateConditions(conditions, options);

            Presentation
                .find(conditions)
                .exec(function(err, presentations) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, presentations);
                    }
                });
        },

        create: function(team, upload, cb) {
            var teamId = getId(team);

            var presentation = new Presentation({
                name: upload.name,
                file: upload,
                team: teamId
            });

            presentation.save(function(err) {
                if(err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }

                if(typeof cb === 'function') {
                    cb(err, presentation);
                }
            });
        },

        publish: function(presentation, team, cb) {
            var presentationId = getId(presentation),
                teamId         = getId(team);

            // Prevent crashes
            if(!ObjectId.isValid(presentationId)) {
                return;
            }
            
            var conditions = {
                _id:  presentationId,
                team: teamId
            };

            var update = {
                published: true
            };

            updatePresentation(conditions, update, cb);
        },

        close: function(presentation, team, cb) {
            var presentationId = getId(presentation),
                teamId         = getId(team);

            // Prevent crashes
            if(!ObjectId.isValid(presentationId)) {
                return;
            }
            
            var conditions = {
                _id:  presentationId,
                team: teamId
            };

            var update = {
                closed: true
            };

            updatePresentation(conditions, update, cb);
        },

        reopen: function(presentation, team, cb) {
            var presentationId = getId(presentation),
                teamId         = getId(team);

            // Prevent crashes
            if(!ObjectId.isValid(presentationId)) {
                return;
            }
            
            var conditions = {
                _id:  presentationId,
                team: teamId
            };

            var update = {
                closed: false
            };

            updatePresentation(conditions, update, cb);
        },

        update: function(presentation, name, description, team, cb) {
            var presentationId = getId(presentation),
                teamId         = getId(team);

            // Prevent crashes
            if(!ObjectId.isValid(presentationId)) {
                return;
            }
            
            var conditions = {
                _id:  presentationId,
                team: teamId
            };

            var update = {
                name:        name,
                description: description
            };

            updatePresentation(conditions, update, cb);
        },

        addSlides: function(presentation, slides, cb) {
            var presentationId = getId(presentation);

            // Prevent crashes
            if(!ObjectId.isValid(presentationId)) {
                return;
            }
            
            var conditions = {
                _id: presentationId
            };

            var update = {
                slides:    slides,
                converted: true
            };

            updatePresentation(conditions, update, cb);
        }
    };
});

// Register the store
miitoo.register('PresentationStore', store);
