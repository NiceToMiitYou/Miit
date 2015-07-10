
// Define the store
var store = miitoo.resolve(['ChatroomModel'], function(Chatroom) {
    var mongoose = miitoo.get('Mongoose');
    var ObjectId = mongoose.Types.ObjectId;

    return {
        create: function(team, name, cb) {
            var chatroom = new Chatroom({
                name:   name,
                teamId: team.id
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
        }
    };
});

// Register the store
miitoo.register('ChatroomStore', store);
