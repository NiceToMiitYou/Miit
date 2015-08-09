
// Define the store
var store = miitoo.resolve(['QuizModel'], function(Quiz) {

    function getId(object) {
        return object._id || object.id || object;
    }

    // Shortcut for update
    function updateQuiz(conditions, update, cb) {
        Quiz.update(conditions, update, function(err, doc) {
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
        findQuiz: function(team, quiz, cb) {
            var teamId = getId(team),
                quizId = getId(quiz);

            Quiz
                .findOne({
                    _id:  quizId,
                    team: teamId
                })
                .exec(function(err, quiz) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, quiz);
                    }
                });
        },

        findQuizzes: function(team, privat, unpublished, closed, cb) {
            var teamId = getId(team);

            var conditions = {
                team: teamId
            };

            if(true !== privat) {
                conditions['private'] = false;

                console.log('Request public quizzes.');
            }

            if(true !== unpublished) {
                conditions['published'] = true;

                console.log('Request published quizzes.');
            }

            if(true !== closed) {
                conditions['closed'] = false;
                conditions['start']  = { $lte: Date.now() };
                conditions['end']    = { $gte: Date.now() };

                console.log('Request opened quizzes.');
            }

            Quiz
                .find(conditions)
                .exec(function(err, quizzes) {
                    // Log the error
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, quizzes);
                    }
                });
        },

        createQuiz: function(name, description, team, user, cb) {
            var teamId = getId(team),
                userId = getId(user);

            var quiz = new Quiz({
                name:        name,
                description: description,
                team:        teamId,
                user:        userId,
                questions:   []
            });

            quiz.save(function(err) {
                if(err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }

                if(typeof cb === 'function') {
                    cb(err, quiz);
                }
            });
        },

        updateQuiz: function(quiz, name, description, team, cb) {
            var quizId = getId(quiz),
                teamId = getId(team);

            var conditions = {
                _id:  quizId,
                team: teamId
            };

            var update = {
                name:        name,
                description: description
            };

            updateQuiz(conditions, update, cb);
        },

        addQuestion: function(quiz, title, subtitle, kind, order, required, team, cb) {
            var quizId = getId(quiz),
                teamId = getId(team);

            var conditions = {
                _id:  quizId,
                team: teamId
            };

            var update = {
                $addToSet: {
                    questions: {
                        title:    title,
                        subtitle: subtitle,
                        kind:     kind,
                        order:    order,
                        required: required,
                        answers:  []
                    }
                }
            };

            updateQuiz(conditions, update, cb);
        },

        updateQuestion: function(quiz, question, title, subtitle, order, required, team, cb) {
            var quizId     = getId(quiz),
                teamId     = getId(team),
                questionId = getId(question);

            var conditions = {
                _id:             quizId,
                team:            teamId,
                'questions._id': questionId
            };

            var update = {
                $set: {
                    'questions.$.title':    title,
                    'questions.$.subtitle': subtitle,
                    'questions.$.order':    order,
                    'questions.$.required': required
                }
            };

            updateQuiz(conditions, update, cb);
        },

        removeQuestion: function(quiz, question, team, cb) {
            var quizId     = getId(quiz),
                teamId     = getId(team),
                questionId = getId(question);

            var conditions = {
                _id:  quizId,
                team: teamId
            };

            var update = {
                $pull: {
                    questions: {
                        _id: questionId
                    }
                }
            };

            updateQuiz(conditions, update, cb);
        }
    };
});

// Register the store
miitoo.register('QuizStore', store);
