
// Define the store
var store = miitoo.resolve(['ChatroomModel'], function(User) {
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

        send: function(team, user, chatroom_id, text) {
            var condition = {
                _id:    chatroom_id,
                teamId: team._id
            };

            var message = {
                user:      user.db_id,
                text:      text,
                createdAt: new Date()
            };

            var update = {
                $addToSet: {
                    messages: message
                }
            };

            Chatroom.update(condition, update, function(err) {
                // Log the error
                if(err) {
                    miitoo.logger.error(err);
                }

                if(typeof cb === 'function') {
                    message.user = user._id;

                    cb(err, message);
                }
            });
        },

        getChatrooms: function(team, cb) {
            Chatroom
                .find({
                    teamId: team._id
                }, 'name')
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
