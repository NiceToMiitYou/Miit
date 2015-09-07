'use strict';

// Define the store
var store = miitoo.resolve(['WallQuestionModel', 'Mongoose'], function(Question, mongoose) {
    var ObjectId = mongoose.Types.ObjectId;

    function getId(object) {
        return object._id || object.id || object;
    }

    // Shortcut for update
    function updateQuestion(conditions, update, cb) {
        Question.update(conditions, update, function(err, doc) {
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
        findQuestions: function(team, privat, cb) {
            var teamId = getId(team);

            var conditions = {
                team: teamId
            };

            if(true === privat) {
                conditions['public'] = true;
            }

            Question
                .find(conditions)
                .exec(function(err, questions) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, questions);
                    }
                });
        },

        create: function(text, team, user, cb) {
            var teamId = getId(team),
                userId = getId(user);

            var question = new Question({
                team: teamId,
                user: userId,
                text: text
            });

            question.save(function(err) {
                // Log the error
                if(err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }

                if(typeof cb === 'function') {
                    cb(err, question);
                }
            });
        },

        remove: function(question, admin, team, user, cb) {
            var questionId = getId(question),
                teamId     = getId(team),
                userId     = getId(user);

            // Prevent crashes
            if(!ObjectId.isValid(questionId)) {
                return;
            }

            var conditions = {
                _id:  questionId,
                team: teamId,
                user: userId
            };

            if(true === admin) {
                delete conditions['user'];
            }

            Question
                .remove(conditions, function(err) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err);
                    }
                });
        },

        like: function(question, team, user, cb) {
            var questionId = getId(question),
                teamId     = getId(team),
                userId     = getId(user);

            // Prevent crashes
            if(!ObjectId.isValid(questionId)) {
                return;
            }

            var conditions = {
                _id:  questionId,
                team: teamId
            };

            var update = {
                $addToSet: {
                    likes: userId
                }
            };

            updateQuestion(conditions, update, cb);
        },

        unlike: function(question, team, user, cb) {
            var questionId = getId(question),
                teamId     = getId(team),
                userId     = getId(user);

            // Prevent crashes
            if(!ObjectId.isValid(questionId)) {
                return;
            }

            var conditions = {
                _id:  questionId,
                team: teamId
            };

            var update = {
                $pull: {
                    likes: userId
                }
            };

            updateQuestion(conditions, update, cb);
        },

        answered: function(question, admin, team, user, cb) {
            var questionId = getId(question),
                teamId     = getId(team),
                userId     = getId(user);

            // Prevent crashes
            if(!ObjectId.isValid(questionId)) {
                return;
            }

            var conditions = {
                _id:  questionId,
                team: teamId,
                user: userId
            };

            if(true === admin) {
                delete conditions['user'];
            }

            var update = {
                answered: true
            };

            updateQuestion(conditions, update, cb);
        },

        unanswered: function(question, admin, team, user, cb) {
            var questionId = getId(question),
                teamId     = getId(team),
                userId     = getId(user);

            // Prevent crashes
            if(!ObjectId.isValid(questionId)) {
                return;
            }

            var conditions = {
                _id:  questionId,
                team: teamId,
                user: userId
            };

            if(true === admin) {
                delete conditions['user'];
            }

            var update = {
                answered: false
            };

            updateQuestion(conditions, update, cb);
        },

        allow: function(question, admin, team, user, cb) {
            var questionId = getId(question),
                teamId     = getId(team),
                userId     = getId(user);

            // Prevent crashes
            if(!ObjectId.isValid(questionId)) {
                return;
            }

            var conditions = {
                _id:  questionId,
                team: teamId,
                user: userId
            };

            if(true === admin) {
                delete conditions['user'];
            }

            var update = {
                allowComments: true
            };

            updateQuestion(conditions, update, cb);
        },

        disallow: function(question, admin, team, user, cb) {
            var questionId = getId(question),
                teamId     = getId(team),
                userId     = getId(user);

            // Prevent crashes
            if(!ObjectId.isValid(questionId)) {
                return;
            }

            var conditions = {
                _id:  questionId,
                team: teamId,
                user: userId
            };

            if(true === admin) {
                delete conditions['user'];
            }

            var update = {
                allowComments: false
            };

            updateQuestion(conditions, update, cb);
        },

        comment: function(question, text, team, user, cb) {
            var questionId = getId(question),
                teamId     = getId(team),
                userId     = getId(user);

            // Prevent crashes
            if(!ObjectId.isValid(questionId)) {
                return;
            }

            var conditions = {
                _id:           questionId,
                team:          teamId,
                allowComments: true
            };

            var comment = {
                _id:       new ObjectId(),
                user:      userId,
                text:      text,
                ansewer:   false,
                createdAt: new Date()
            };

            var update = {
                $addToSet: {
                    comments: comment
                }
            };

            Question.update(conditions, update, {
                'new': true
            }, function(err, doc) {
                // Log the error
                if(err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }

                if(typeof cb === 'function') {
                    // Swap field id
                    comment.id = comment._id;
                    delete comment._id;

                    cb(err, comment);
                }
            });
        },

        uncomment: function(question, comment, admin, team, user, cb) {
            var questionId = getId(question),
                commentId  = getId(comment),
                teamId     = getId(team),
                userId     = getId(user);

            // Prevent crashes
            if(!ObjectId.isValid(questionId) || !ObjectId.isValid(commentId)) {
                return;
            }

            var conditions = {
                _id:  questionId,
                team: teamId,
                user: userId
            };

            if(true === user) {
                delete conditions['user'];
            }

            var update = {
                $pull: {
                    'comments': {
                        _id: commentId
                    }
                }
            };
            
            updateQuestion(conditions, update, cb);
        }
    };
});

// Register the store
miitoo.register('WallQuestionStore', store);
