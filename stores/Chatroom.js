
// Define the store
var store = miitoo.resolve(['ChatroomModel'], function(Chatroom) {
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
            var userId = user._id || user.id;

            var condition = {
                _id:    chatroom_id,
                teamId: team._id || team.id
            };

            var message = {
                user:      userId,
                text:      text,
                createdAt: new Date()
            };

            var update = {
                $addToSet: {
                    messages: message
                }
            };

            Chatroom.findOneAndUpdate(condition, update, {
                'new': true
            }, function(err, doc) {
                // Log the error
                if(err) {
                    miitoo.logger.error(err);
                }

                console.log(doc);

                if(typeof cb === 'function') {
                    cb(err, message);
                }
            });
        },

        getChatrooms: function(team, cb) {
            Chatroom
                .find({
                    teamId: team._id
                }, {
                    name:     true,
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
