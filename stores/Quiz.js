
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
                }, {
                    'questions.answers.choices' : false
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
                .select('-questions.answers.choices')
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

            var answers = [];

            if(3 === kind) {
                answers.push({
                    title: '',
                    kind:  2,
                    order: 0
                });
            }

            var update = {
                $addToSet: {
                    questions: {
                        title:    title,
                        subtitle: subtitle,
                        kind:     kind,
                        order:    order,
                        required: required,
                        answers:  answers
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
        },

        addAnswer: function(quiz, question, title, kind, order, team, cb) {
            var quizId     = getId(quiz),
                questionId = getId(question),
                teamId     = getId(team);

            var conditions = {
                _id:             quizId,
                team:            teamId,
                'questions._id': questionId
            };

            var update = {
                $addToSet: {
                    'questions.$.answers': {
                        title:    title,
                        kind:     kind,
                        order:    order
                    }
                }
            };

            updateQuiz(conditions, update, cb);
        },

        updateAnswer: function(quiz, question, answer, title, order, team, cb) {
            var quizId     = getId(quiz),
                teamId     = getId(team),
                questionId = getId(question),
                answerId   = getId(answer);

            this.findQuiz(team, quiz, function(err, instance) {
                if(err) {
                    return;
                }

                var foundQuestion = -1;

                // Find the question
                for(var i = 0; i < instance.questions.length; i++) {
                    if(instance.questions[i].id == questionId) {
                        foundQuestion = i;
                        break;
                    }
                }

                // If exist
                if(-1 !== foundQuestion) {

                    var foundAnswer = -1;

                    // Find the answer
                    for(var i = 0; i < instance.questions[foundQuestion].answers.length; i++) {
                        if(instance.questions[foundQuestion].answers[i].id == answerId) {
                            foundAnswer = i;
                            break;
                        }
                    }

                    // If exist proceed to the update
                    if(-1 !== foundAnswer) {

                        var conditions = {
                            _id:                     quizId,
                            team:                    teamId,
                            'questions._id':         questionId,
                            'questions.answers._id': answerId
                        };

                        var update = {
                            $set: {}
                        };

                        update['$set']['questions.' + foundQuestion + '.answers.' + foundAnswer + '.title'] = title;
                        update['$set']['questions.' + foundQuestion + '.answers.' + foundAnswer + '.order'] = order;

                        updateQuiz(conditions, update, cb);
                    }
                }
            });

        },

        removeAnswer: function(quiz, question, answer, team, cb) {
            var quizId     = getId(quiz),
                teamId     = getId(team),
                questionId = getId(question),
                answerId   = getId(answer);

            var conditions = {
                _id:             quizId,
                team:            teamId,
                'questions._id': questionId
            };

            var update = {
                $pull: {
                    'questions.$.answers': {
                        _id: answerId
                    }
                }
            };

            updateQuiz(conditions, update, cb);
        }
    };
});

// Register the store
miitoo.register('QuizStore', store);
