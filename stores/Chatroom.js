
// Define the store
var store = miitoo.resolve(['ChatroomModel'], function(Chatroom) {
    var mongoose = miitoo.get('Mongoose');
    var ObjectId = mongoose.Types.ObjectId;

    function getId(object) {
        return object._id || object.id || object;
    }

    return {
        create: function(team, name, cb) {
            var teamId = getId(team);

            var chatroom = new Chatroom({
                name:   name,
                teamId: teamId
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
            var chatroomId = getId(chatroom);
            var teamId     = getId(team);

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

        send: function(team, user, chatroom, text, cb) {
            var chatroomId = getId(chatroom);
            var teamId     = getId(team);
            var userId     = getId(user);

            var condition = {
                _id:    chatroomId,
                teamId: teamId
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
            var teamId = getId(team);

            Chatroom
                .find({
                    teamId: teamId
                }, {
                    messages:      false
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
            var chatroomId = new ObjectId(getId(chatroom));

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
            var chatroomId = new ObjectId(getId(chatroom));

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
