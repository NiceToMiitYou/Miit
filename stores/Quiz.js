
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

    function updateConditions(conditions, options) {
        var userId = (options || {});

        if(!options) {
            return;
        }

        if(true !== options.private) {
            conditions['public'] = true;

            console.log('Request public quizzes.');
        }

        if(true !== options.unpublished) {
            conditions['published'] = true;

            console.log('Request published quizzes.');
        }

        if(true !== options.closed) {
            conditions['closed'] = false;
            //conditions['start']  = { $gte: Date.now() };
            //conditions['end']    = { $lte: Date.now() };

            console.log('Request opened quizzes.');
        }
    }

    return {
        findQuiz: function(team, quiz, options, cb) {
            var teamId = getId(team),
                quizId = getId(quiz);

            if(typeof options === 'function') {
                cb      = options;
                options = null;
            }

            var conditions = {
                _id:  quizId,
                team: teamId
            };

            // define specific conditions
            updateConditions(conditions, options);

            Quiz
                .findOne(conditions)
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

        findQuizzes: function(team, options, cb) {
            var teamId = getId(team);

            var conditions = {
                team: teamId
            };

            // define specific conditions
            updateConditions(conditions, options);

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

        findChoices: function(team, user, options, cb) {
            var teamId = getId(team).toString(),
                userId = getId(user);

            var conditions = {
                team: teamId
            };

            // Get choices if can display the quiz
            updateConditions(conditions, options);

            var aggregate = [
                { 
                    '$match': conditions
                },
                {
                    '$unwind': '$questions'
                },
                {
                    '$unwind': '$questions.answers'
                },
                {
                    '$unwind': '$questions.answers.choices'
                },
                {
                    '$match': {
                        'questions.answers.choices.user': userId
                    }
                },
                {
                    '$project': {
                        '_id': '$_id',
                        'answer': {
                            'id':    '$questions.answers._id',
                            'extra': '$questions.answers.choices.extra'
                        }
                    }
                },
                {
                    '$group': {
                        '_id': '$_id',
                        'choices': {
                            '$push': '$answer'
                        }
                    }
                },
                {
                    '$project': {
                        'id':      '$_id',
                        'choices': '$choices',
                        '_id':     0
                    }
                }
            ];

            Quiz
                .aggregate(aggregate, function(err, choices) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, choices);
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

        publishQuiz: function(quiz, team, cb) {
            var quizId = getId(quiz),
                teamId = getId(team);

            var conditions = {
                _id:  quizId,
                team: teamId
            };

            var update = {
                published: true
            };

            updateQuiz(conditions, update, cb);
        },

        closeQuiz: function(quiz, team, cb) {
            var quizId = getId(quiz),
                teamId = getId(team);

            var conditions = {
                _id:  quizId,
                team: teamId
            };

            var update = {
                closed: true
            };

            updateQuiz(conditions, update, cb);
        },

        reopenQuiz: function(quiz, team, cb) {
            var quizId = getId(quiz),
                teamId = getId(team);

            var conditions = {
                _id:  quizId,
                team: teamId
            };

            var update = {
                closed: false
            };

            updateQuiz(conditions, update, cb);
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
        },

        saveChoices: function(quiz, user, choices, team, cb) {
            var quizId = getId(quiz),
                userId = getId(user),
                teamId = getId(team);

            this.removeChoices(quiz, user, team, function(errRemove) {
                if(errRemove) {
                    return;
                }

                this.findQuiz(team, quiz, function(err, instance) {
                    if(err) {
                        return;
                    }

                    // Prepare update
                    var conditions = {
                        _id:  quizId,
                        team: teamId
                    };

                    var update = {
                        $addToSet: {}
                    };

                    var found = false;

                    // Foreach choice
                    choices.forEach(function(question) {
                        var questionId    = question.id;
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

                            // Foreach answer choiced
                            question.choices.forEach(function(answer) {

                                var answerId    = answer.id;
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
                                    var key = 'questions.' + foundQuestion + '.answers.' + foundAnswer + '.choices';

                                    update['$addToSet'][key] = {
                                        user: userId
                                    };

                                    // Check for extra
                                    if(answer.text) {
                                        // Define extra
                                        var extra = [{
                                            key:   'text',
                                            value: answer.text
                                        }];

                                        update['$addToSet'][key]['extra'] = extra;
                                    }

                                    found = true;
                                }
                            });
                        }
                    });

                    // Save choices if match found
                    if(true === found) {
                        updateQuiz(conditions, update, cb);
                    }
                });
            }.bind(this));
        },

        removeChoices: function(quiz, user, team, cb) {
            var quizId = getId(quiz),
                userId = getId(user),
                teamId = getId(team);

            this.findQuiz(team, quiz, function(err, instance) {
                if(err || !instance) {
                    return;
                }

                // Prepare update
                var conditions = {
                    _id:  quizId,
                    team: teamId
                };

                var update = {
                    $pull: {}
                };

                // Foreach questions
                for(var i = 0; i < instance.questions.length; i++) {
                    // Find the answer
                    for(var j = 0; j < instance.questions[i].answers.length; j++) {

                        var key = 'questions.' + i + '.answers.' + j + '.choices';
                        
                        update['$pull'][key] = {
                            user: userId
                        };
                    }
                }

                updateQuiz(conditions, update, cb);
            });
        }
    };
});

// Register the store
miitoo.register('QuizStore', store);
