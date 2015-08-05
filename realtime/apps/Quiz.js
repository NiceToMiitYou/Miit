'use strict';

module.exports = function QuizApp() {
    this.identifier = function() {
        return 'APP_QUIZ';
    }

    var app = this;

    var QuizStore = miitoo.get('QuizStore');

    var primus     = miitoo.get('Primus');
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    function sendRefreshAction(team) {
        primus.in(team.id + ':' + app.identifier()).write({
            event: 'quiz:refresh'
        });
    }

    // List quizzes
    Dispatcher.register('quiz:quizzes', 'USER', app.identifier(), function onListQuizzes(spark, data, team, user, roles) {
        // Check for roles
        var isAdmin = -1 !== roles.indexOf('ADMIN');
        var isUser  = -1 !== roles.indexOf('USER');

        // Display private if admin or if user and team public
        var privat = isAdmin || team.public && isUser;

        // Display unpublished, closed if admin
        var unpublished = isAdmin,
            closed      = isAdmin;

        QuizStore.findQuizzes(team, privat, unpublished, closed, function(err, quizzes) {
            spark.write({
                event:   'quiz:quizzes',
                quizzes: quizzes
            });
        });
    });

    // Create a quiz
    Dispatcher.register('quiz:create', 'ADMIN', app.identifier(), function onCreateQuiz(spark, data, team, user) {
        var name        = data.name,
            description = data.description;

        if(!name) {
            return;
        }

        QuizStore.createQuiz(name, description, team, user, function(err, quizz) {
            sendRefreshAction(team);
        });
    });

    // Update a quiz
    Dispatcher.register('quiz:update', 'ADMIN', app.identifier(), function onUpdateQuiz(spark, data, team, user) {
        var quizId      = data.id,
            name        = data.name,
            description = data.description;

        if(!quizId || !name) {
            return;
        }

        QuizStore.updateQuiz(quizId, name, description, team, function(err, chatroom) {
            sendRefreshAction(team);
        });
    });
};