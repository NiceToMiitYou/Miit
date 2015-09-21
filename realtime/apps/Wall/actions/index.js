'use strict';

module.exports = function WallActions(app) {
    var WallQuestionStore = miitoo.get('WallQuestionStore');

    var primus     = miitoo.get('Primus');
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    Dispatcher.load(app.identifier(), {
        writes: [
            'wall:questions:create',
            'wall:questions:remove',
            'wall:questions:like',
            'wall:questions:unlike',
            'wall:comments:create',
            'wall:comments:remove',
            'wall:comments:allow',
            'wall:comments:disallow'
        ]
    });

    // List questions
    Dispatcher.register('wall:questions:list', 'USER', function onListQuestions(spark, data, team, user) {
        var refresh = true;

        if(data.last) {
            refresh = false;
        }

        var last  = data.last  || new Date(),
            count = data.count || 20;

        WallQuestionStore.findQuestions(team, false, last, count, function(err, questions) {

            // Extract questions likes by user
            var likes = questions.filter(function(question) {
                return true === question.isLiked(user.id);
            }).map(function(question) {
                return question.id;
            });

            spark.write({
                event:     'wall:questions:list',
                questions: questions,
                likes:     likes,
                refresh:   refresh
            });
        });
    });

    // Create a question
    Dispatcher.register('wall:questions:create', 'USER', function onCreateQuestion(spark, data, team, user) {
        var text  = data.text  || '',
            allow = data.allow;

        if(
            !text || typeof text !== 'string' || !text.trim() || 
            (
                false !== allow && true !== allow
            )
        ) {
            return;
        }

        WallQuestionStore.create(text, allow, team, user, function(err, question) {
            var room = team.id + ':' + app.identifier();

            primus.in(room).write({
                event:    'wall:questions:new',
                question: question
            });
        });
    });

    // Like a question
    Dispatcher.register('wall:questions:like', 'USER', function onLikeQuestion(spark, data, team, user) {
        var questionId = data.id;

        if(!questionId) {
            return;
        }

        WallQuestionStore.like(questionId, team, user, function(err, question) {
            if(err || !question) {
                return;
            }

            var room = team.id + ':' + app.identifier();

            primus.in(room).write({
                event:    'wall:questions:like',
                question: questionId
            });

            // Send to user he likes the question
            spark.write({
                event:    'wall:questions:ilike',
                question: questionId
            });
        });
    });

    // Unlike a question
    Dispatcher.register('wall:questions:unlike', 'USER', function onUnlikeQuestion(spark, data, team, user) {
        var questionId = data.id;

        if(!questionId) {
            return;
        }

        WallQuestionStore.unlike(questionId, team, user, function(err, question) {
            if(err || !question) {
                return;
            }

            var room = team.id + ':' + app.identifier();

            primus.in(room).write({
                event:    'wall:questions:unlike',
                question: questionId
            });

            // Send to user he unlikes the question
            spark.write({
                event:    'wall:questions:iunlike',
                question: questionId
            });
        });
    });

    // Mark answered a question
    Dispatcher.register('wall:questions:answered', 'USER', function onAnseweredQuestion(spark, data, team, user, roles) {
        var questionId = data.id;

        if(!questionId) {
            return;
        }

        var admin = -1 !== roles.indexOf('ADMIN');

        WallQuestionStore.answered(questionId, admin, team, user, function(err, question) {
            if(err || !question) {
                return;
            }

            var room = team.id + ':' + app.identifier();

            primus.in(room).write({
                event:    'wall:questions:answered',
                question: questionId
            });
        });
    });

    // Mark unanswered a question
    Dispatcher.register('wall:questions:unanswered', 'USER', function onUnanseweredQuestion(spark, data, team, user, roles) {
        var questionId = data.id;

        if(!questionId) {
            return;
        }

        var admin = -1 !== roles.indexOf('ADMIN');

        WallQuestionStore.unanswered(questionId, admin, team, user, function(err, question) {
            if(err || !question) {
                return;
            }

            var room = team.id + ':' + app.identifier();

            primus.in(room).write({
                event:    'wall:questions:unanswered',
                question: questionId
            });
        });
    });

    // Mark unanswered a question
    Dispatcher.register('wall:questions:remove', 'USER', function onRemoveQuestion(spark, data, team, user, roles) {
        var questionId = data.id;

        if(!questionId) {
            return;
        }

        var admin = -1 !== roles.indexOf('ADMIN');

        WallQuestionStore.remove(questionId, admin, team, user, function(err) {
            if(err) {
                return;
            }

            var room = team.id + ':' + app.identifier();

            primus.in(room).write({
                event:    'wall:questions:remove',
                question: questionId
            });
        });
    });

    // Comment a question
    Dispatcher.register('wall:comments:create', 'USER', function onCommentQuestion(spark, data, team, user) {
        var questionId = data.id,
            text       = data.text || '';

        if(!questionId || !text || typeof text !== 'string' || !text.trim()) {
            return;
        }

        WallQuestionStore.comment(questionId, text, team, user, function(err, comment) {
            var room = team.id + ':' + app.identifier();

            primus.in(room).write({
                event:    'wall:comments:create',
                question: questionId,
                comment:  comment
            });
        });
    });

    // Allow comments on a question
    Dispatcher.register('wall:comments:allow', 'USER', function onAllowComment(spark, data, team, user, roles) {
        var questionId = data.id;

        if(!questionId) {
            return;
        }

        var admin = -1 !== roles.indexOf('ADMIN');

        WallQuestionStore.allow(questionId, admin, team, user, function(err, question) {
            if(err || !question) {
                return;
            }

            var room = team.id + ':' + app.identifier();

            primus.in(room).write({
                event:    'wall:comments:allow',
                question: questionId
            });
        });
    });

    // Disallow comments on a question
    Dispatcher.register('wall:comments:disallow', 'USER', function onDisallowComment(spark, data, team, user, roles) {
        var questionId = data.id;

        if(!questionId) {
            return;
        }

        var admin = -1 !== roles.indexOf('ADMIN');

        WallQuestionStore.disallow(questionId, admin, team, user, function(err, question) {
            if(err || !question) {
                return;
            }

            var room = team.id + ':' + app.identifier();

            primus.in(room).write({
                event:    'wall:comments:disallow',
                question: questionId
            });
        });
    });

    // Uncomment a question
    Dispatcher.register('wall:comments:remove', 'USER', function onRemoveComment(spark, data, team, user, roles) {
        var questionId = data.id,
            commentId  = data.comment;

        if(!questionId || !commentId) {
            return;
        }

        var admin = -1 !== roles.indexOf('ADMIN');

        WallQuestionStore.uncomment(questionId, commentId, admin, team, user, function(err) {
            if(err) {
                return;
            }

            var room = team.id + ':' + app.identifier();

            primus.in(room).write({
                event:    'wall:comments:remove',
                question: questionId,
                comment:  commentId
            });
        });
    });

    Dispatcher.reset();
};