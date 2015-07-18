
// Define the store
var store = miitoo.resolve(['ChatroomModel'], function(Chatroom) {
    var mongoose = miitoo.get('Mongoose');
    var ObjectId = mongoose.Types.ObjectId;

    return {
        create: function(team, name, cb) {
            var chatroom = new Chatroom({
                name:   name,
                teamId: team._id || team.id || team
            });

            chatroom.save(function(err) {
                if(err) {
                    miitoo.logger.debug(err);
                }

                if(typeof cb === 'function') {
                    cb(err, chatroom);
                }
            });
        },

        delete: function(team, chatroom, cb) {
            var chatroomId = chatroom._id || chatroom.id || chatroom;
            var teamId     = team._id || team.id || team;

            Chatroom.remove({
                _id:    chatroomId,
                teamId: teamId
            }, function(err) {
                if(err) {
                    miitoo.logger.debug(err);
                }

                if(typeof cb === 'function') {
                    cb(err);
                }
            });
        },

        send: function(team, user, chatroom_id, text, cb) {
            var userId = user._id || user.id || user;

            var condition = {
                _id:    chatroom_id,
                teamId: team._id || team.id
            };

            var message = {
                _id:       new ObjectId(),
                user:      userId,
                text:      text,
                createdAt: new Date()
            };

            var update = {
                $addToSet: {
                    messages: message
                }
            };

            Chatroom.update(condition, update, {
                'new': true
            }, function(err, doc) {
                // Log the error
                if(err) {
                    miitoo.logger.error(err);
                }

                if(typeof cb === 'function') {
                    // Swap field id
                    message.id = message._id;
                    delete message._id;

                    cb(err, message);
                }
            });
        },

        getChatrooms: function(team, cb) {
            Chatroom
                .find({
                    teamId: team._id || team.id || team
                }, {
                    messages: false
                })
                .exec(function(err, chatrooms) {
                    if(err) {
                        miitoo.logger.debug(err);
                    }

                    if(typeof cb === 'function') {
                        var rooms = (chatrooms || []).map(function(chatroom) {
                            return {
                                id:   chatroom._id,
                                name: chatroom.name
                            };
                        });

                        cb(err, rooms);
                    }
                });
        },

        getLastMessages: function(team, chatroom, count, cb) {
            var count = Math.abs(count);
            var limit = (count > 100 ) ? 100 : count;

            // Get the id of the chatroom
            var chatroomId = new ObjectId(chatroom._id || chatroom.id || chatroom);

            var aggregate = [
                {
                    '$match': { _id: chatroomId }
                },
                {
                    '$unwind': '$messages'
                },
                {
                    '$project': {
                        id:        '$messages._id',
                        text:      '$messages.text',
                        user:      '$messages.user',
                        createdAt: '$messages.createdAt',
                        _id: 0
                    }
                },
                {
                    '$sort': { createdAt: -1 }
                },
                {
                    '$limit': limit
                }
            ];

            Chatroom
                .aggregate(aggregate, function(err, messages) {
                    if(err) {
                        miitoo.logger.debug(err);
                    }

                    if(typeof cb === 'function') {
                        cb(err, messages);
                    }
                });

        },

        getMessages: function(team, chatroom, last, count, cb) {
            // Define the limit, block the result to 100
            var count = Math.abs(count);
            var limit = (count > 100 ) ? 100 : count;

            // Get the id of the chatroom
            var chatroomId = new ObjectId(chatroom._id || chatroom.id || chatroom);

            var aggregate = [
                {
                    '$match': { _id: chatroomId }
                },
                {
                    '$unwind': '$messages'
                },
                {
                    '$project': {
                        id:        '$messages._id',
                        text:      '$messages.text',
                        user:      '$messages.user',
                        createdAt: '$messages.createdAt'
                    }
                },
                {
                    '$match': {
                        createdAt: {
                            '$lte': new Date(last)
                        }
                    }
                },
                {
                    '$sort': { createdAt: -1 }
                },
                {
                    '$limit': limit
                }
            ];

            Chatroom
                .aggregate(aggregate, function(err, messages) {
                    if(err) {
                        miitoo.logger.debug(err);
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
