'use strict';

// Define the store
var store = miitoo.resolve(['ChatroomModel', 'ChatmessageModel', 'Mongoose'], function(Chatroom, Chatmessage, mongoose) {
    function getId(object) {
        return String(object._id || object.id || object);
    }

    return {
        create: function(team, name, cb) {
            var teamId = getId(team);

            var chatroom = new Chatroom({
                name: name,
                team: teamId
            });

            chatroom.save(function(err) {
                if(err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }

                if(typeof cb === 'function') {
                    cb(err, chatroom);
                }
            });
        },

        remove: function(team, chatroom, cb) {
            var chatroomId = getId(chatroom);
            var teamId     = getId(team);

            // Remove messages, then chatroom
            Chatmessage.remove({
                chatroom: chatroomId
            }, function(err) {
                if(err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }
                
                Chatroom.remove({
                    _id:  chatroomId,
                    team: teamId
                }, function(err) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err);
                    }
                });
            });
        },

        send: function(team, user, chatroom, text, cb) {
            var chatroomId = getId(chatroom),
                teamId     = getId(team),
                userId     = getId(user);

            var message = new Chatmessage({
                user:     userId,
                text:     text,
                chatroom: chatroomId
            });

            message.save(function(err) {
                // Log the error
                if(err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }

                if(typeof cb === 'function') {
                    cb(err, message);
                }
            });
        },

        getChatrooms: function(team, cb) {
            var teamId = getId(team);

            Chatroom
                .find({
                    team: teamId
                })
                .exec(function(err, chatrooms) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, chatrooms);
                    }
                });
        },

        getLastMessages: function(team, chatroom, count, cb) {
            var teamId     = getId(team),
                chatroomId = getId(chatroom);

            // Define limitations
            var count = Math.abs(count),
                limit = (count > 100 ) ? 100 : count;

            var conditions = {
                chatroom: chatroomId
            };

            Chatmessage
                .find(conditions)
                .populate({
                    path: 'chatroom',
                    match: {
                        team: teamId
                    }
                })
                .sort({ createdAt: -1 })
                .limit(limit)
                .exec(function(err, messages) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, messages);
                    }
                });
        },

        getMessages: function(team, chatroom, last, count, cb) {
            var teamId     = getId(team),
                chatroomId = getId(chatroom);

            // Define limitations
            var count = Math.abs(count);
            var limit = (count > 100 ) ? 100 : count;


            var conditions = {
                chatroom: chatroomId,
                createdAt: {
                    $lt: new Date(last)
                }
            };

            Chatmessage
                .find(conditions)
                .populate({
                    path: 'chatroom',
                    match: {
                        team: teamId
                    }
                })
                .sort({ createdAt: -1 })
                .limit(limit)
                .exec(function(err, messages) {
                    if(err) {
                        miitoo.logger.error(err.message);
                        miitoo.logger.error(err.stack);
                    }

                    if(typeof cb === 'function') {
                        cb(err, messages);
                    }
                });

        }
    };
});

// Register the store
miitoo.register('ChatroomStore', store);