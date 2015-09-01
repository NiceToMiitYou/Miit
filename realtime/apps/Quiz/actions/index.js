'use strict';

// Extend array for quiz validation
require('../../../../shared/lib/array-extensions');

module.exports = function QuizActions(app) {
    var QuizStore      = miitoo.get('QuizStore');
    var QuizValidation = require('../../../../shared/apps/quiz/validation');

    var primus     = miitoo.get('Primus');
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    function sendRefreshAction(team) {
        primus.in(team.id + ':' + app.identifier()).write({
            event: 'quiz:refresh:quizzes'
        });
    }

    function sendRefreshStatsAction(team, quiz) {
        primus.in(team.id + ':' + app.identifier() + ':ADMIN').write({
            event: 'quiz:refresh:stats',
            quiz:  quiz
        });
    }

    function optionsQuiz(team, roles) {
        // Check for roles
        var isAdmin = -1 !== roles.indexOf('ADMIN');
        var isUser  = -1 !== roles.indexOf('USER');

        return {
            // Display private if admin or if user and team public
            private:     isAdmin || team.public && isUser,
            
            // Display unpublished, closed if admin
            unpublished: isAdmin,
            closed:      isAdmin
        };
    }

    // List quizzes
    Dispatcher.register('quiz:quizzes', 'USER', app.identifier(), function onListQuizzes(spark, data, team, user, roles) {

        // Get options
        var options = optionsQuiz(team, roles);

        // Retreive quizzes based on options
        QuizStore.findQuizzes(team, options, function(err, quizzes) {

            // Retreive choices based on options
            QuizStore.findChoices(team, user, options, function(err, choices) {
                spark.write({
                    event:   'quiz:quizzes',
                    quizzes: quizzes,
                    choices: choices
                });
            });
        });
    });

    // get Stats of a quiz
    Dispatcher.register('quiz:stats', 'ADMIN', app.identifier(), function onGetStats(spark, data, team, user) {
        var quizId = data.id;

        if(!quizId) {
            return;
        }

        // Retreive stats of a quiz based on options
        QuizStore.getStats(team, quizId, function(err, stats) {

            spark.write({
                event: 'quiz:stats',
                quiz:  quizId,
                stats: stats
            });
        });
    });

    // Create a quiz
    Dispatcher.register('quiz:create', 'ADMIN', app.identifier(), function onCreateQuiz(spark, data, team, user) {
        var name        = data.name || '',
            description = data.description || '';

        if(
            'string' !== typeof name ||
            'string' !== typeof description ||
            !name || !name.trim()
        ) {
            return;
        }

        name        = name.trim();
        description = description.trim();

        QuizStore.createQuiz(name, description, team, user, function(err, quiz) {
            // Send quiz to creator to open it
            spark.write({
                event: 'quiz:create',
                quiz:  quiz,
                open:  true
            });

            // Send the event to all admins
            primus.except(spark.id).in(team.id + ':' + app.identifier() + ':ADMIN').write({
                event: 'quiz:create',
                quiz:  quiz,
                open:  false
            });
        });
    });

    // Publish a quiz
    Dispatcher.register('quiz:publish', 'ADMIN', app.identifier(), function onPubishQuiz(spark, data, team, user) {
        var quizId = data.id;

        if(!quizId) {
            return;
        }

        QuizStore.publishQuiz(quizId, team, function(err, quiz) {
            sendRefreshAction(team);
        });
    });

    // Close a quiz
    Dispatcher.register('quiz:close', 'ADMIN', app.identifier(), function onCloseQuiz(spark, data, team, user) {
        var quizId = data.id;

        if(!quizId) {
            return;
        }

        QuizStore.closeQuiz(quizId, team, function(err, quiz) {
            sendRefreshAction(team);
        });
    });

    // Reopen a quiz
    Dispatcher.register('quiz:reopen', 'ADMIN', app.identifier(), function onCloseQuiz(spark, data, team, user) {
        var quizId = data.id;

        if(!quizId) {
            return;
        }

        QuizStore.reopenQuiz(quizId, team, function(err, quiz) {
            sendRefreshAction(team);
        });
    });

    // Update a quiz
    Dispatcher.register('quiz:update', 'ADMIN', app.identifier(), function onUpdateQuiz(spark, data, team, user) {
        var quizId      = data.id,
            name        = data.name || '',
            description = data.description || '';

        if(
            !quizId ||
            'string' !== typeof name ||
            'string' !== typeof description ||
            !name || !name.trim()
        ) {
            return;
        }

        name        = name.trim();
        description = description.trim();

        QuizStore.updateQuiz(quizId, name, description, team, function(err, quiz) {
            sendRefreshAction(team);
        });
    });

    // Add a question to a quiz
    Dispatcher.register('quiz:questions:add', 'ADMIN', app.identifier(), function onAddQuestion(spark, data, team, user) {
        var quizId   = data.quiz,
            title    = data.title || '',
            subtitle = data.subtitle || '',
            kind     = data.kind || 1,
            order    = data.order,
            required = true === data.required;

        if(
            !quizId ||
            'string' !== typeof title ||
            'string' !== typeof subtitle ||
            (kind !== 1 && kind !== 2 && kind !== 3) ||
            !title || !title.trim()
        ) {
            return;
        }

        title    = title.trim();
        subtitle = subtitle.trim();

        QuizStore.addQuestion(quizId, title, subtitle, kind, order, required, team, function(err, quiz) {
            sendRefreshAction(team);
        });
    });

    // Update a question to a quiz
    Dispatcher.register('quiz:questions:update', 'ADMIN', app.identifier(), function onUpdateQuestion(spark, data, team, user) {
        var questionId = data.question,
            quizId     = data.quiz,
            title      = data.title || '',
            subtitle   = data.subtitle || '',
            order      = data.order,
            required   = true === data.required;

        if(
            !quizId || !questionId ||
            'string' !== typeof title ||
            'string' !== typeof subtitle ||
            !title || !title.trim()
        ) {
            return;
        }

        title    = title.trim();
        subtitle = subtitle.trim();

        QuizStore.updateQuestion(quizId, questionId, title, subtitle, order, required, team, function(err, quiz) {
            sendRefreshAction(team);
        });
    });

    // Remove a question to a quiz
    Dispatcher.register('quiz:questions:remove', 'ADMIN', app.identifier(), function onRemoveQuestion(spark, data, team, user) {
        var questionId = data.question,
            quizId     = data.quiz;

        if(!quizId || !questionId) {
            return;
        }

        QuizStore.removeQuestion(quizId, questionId, team, function(err, quiz) {
            sendRefreshAction(team);
        });
    });

    // Add an answer to a quiz
    Dispatcher.register('quiz:answers:add', 'ADMIN', app.identifier(), function onAddAnswer(spark, data, team, user) {
        var quizId     = data.quiz,
            questionId = data.question,
            title      = data.title || '',
            kind       = data.kind || 1,
            order      = data.order;

        if(
            !quizId || !questionId ||
            'string' !== typeof title ||
            (kind !== 1 && kind !== 2) ||
            !title || !title.trim()
        ) {
            return;
        }

        title = title.trim();

        QuizStore.addAnswer(quizId, questionId, title, kind, order, team, function(err, quiz) {
            sendRefreshAction(team);
        });
    });

    // Update an answer to a quiz
    Dispatcher.register('quiz:answers:update', 'ADMIN', app.identifier(), function onUpdateAnswer(spark, data, team, user) {
        var answerId   = data.answer,
            questionId = data.question,
            quizId     = data.quiz,
            title      = data.title || '',
            order      = data.order;

        if(
            !quizId || !questionId || !answerId ||
            'string' !== typeof title ||
            !title || !title.trim()
        ) {
            return;
        }

        title = title.trim();

        QuizStore.updateAnswer(quizId, questionId, answerId, title, order, team, function(err, quiz) {
            sendRefreshAction(team);
        });
    });

    // Remove an answer to a quiz
    Dispatcher.register('quiz:answers:remove', 'ADMIN', app.identifier(), function onRemoveAnswer(spark, data, team, user) {
        var answerId   = data.answer,
            questionId = data.question,
            quizId     = data.quiz;

        if(!quizId || !questionId || !answerId) {
            return;
        }

        QuizStore.removeAnswer(quizId, questionId, answerId, team, function(err, quiz) {
            sendRefreshAction(team);
        });
    });

    // Remove an answer to a quiz
    Dispatcher.register('quiz:choices', 'USER', app.identifier(), function onSendChoices(spark, data, team, user, roles) {
        var quizId  = data.quiz,
            choices = data.choices;

        if(!quizId || !choices) {
            return;
        }

        // Get options
        var options = optionsQuiz(team, roles);

        // Retreive quiz based on options
        QuizStore.findQuiz(team, quizId, options, function(err, quiz) {
            if(err || !quiz) {
                return;
            }

            var validation = new QuizValidation(quiz.questions, choices);

            validation.validate();

            if(false === validation.isValid()) {
                miitoo.logger.debug(validation.getErrors());

                return;
            }

            // Retreive clean choices
            var clean = validation.getChoices();

            QuizStore.saveChoices(quiz, user, clean, team, function(err) {
                if(err) {
                    return;
                }

                sendRefreshAction(team);
                sendRefreshStatsAction(team, quizId);
            });
        });
    });
};