'use strict';

module.exports = function ChatActions(app) {
    var ChatroomStore     = miitoo.get('ChatroomStore');
    var SubscriptionStore = miitoo.get('SubscriptionStore');

    var primus     = miitoo.get('Primus');
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    function sendRooms(team) {
        // Send the list of chatrooms
        ChatroomStore.getChatrooms(team, function(err, chatrooms) {
            var room = team.id + ':' + app.identifier();

            // Send the informations to the whole app user
            primus.in(room).write({
                event:     'chat:rooms',
                chatrooms: chatrooms
            });
        });
    }

    Dispatcher.load(app.identifier(), {
        writes: [
            'chat:create',
            'chat:remove',
            'chat:send'
        ]
    });

    // Create a chatroom
    Dispatcher.register('chat:create', 'ADMIN', function onCreateChatroom(spark, data, team, user) {
        var name = data.name;

        if(!name) {
            return;
        }

        ChatroomStore.create(team, name, function(err, chatroom) {
            sendRooms(team);
        });
    });

    // Delete a chatroom
    Dispatcher.register('chat:remove', 'ADMIN', function onCreateChatroom(spark, data, team, user) {
        var chatroom = data.chatroom;

        if(!chatroom) {
            return;
        }

        ChatroomStore.remove(team, chatroom, function(err) {
            
            SubscriptionStore.resetAllBySender(team, chatroom, function() {

                sendRooms(team);
            });
        });
    });

    // Send a message
    Dispatcher.register('chat:send', 'USER', function onSendMessage(spark, data, team, user) {
        var chatroom = data.chatroom;
        var text     = data.text || '';

        if(
            !chatroom ||
            'string' !== typeof text ||
            !text || !text.trim()
        ) {
            return;
        }

        ChatroomStore.send(team, user, chatroom, text, function(err, message) {
            var identifier = app.identifier();

            var room = team.id + ':' + identifier;

            primus.in(room).write({
                event:    'chat:message',
                chatroom: chatroom,
                message:  message
            });

            SubscriptionStore.increment(identifier, team, user, chatroom);
        });
    });

    // Get the list of chatrooms
    Dispatcher.register('chat:rooms', 'USER', function sendChatrooms(spark, data, team, user) {
        ChatroomStore.getChatrooms(team, function(err, chatrooms) {
            spark.write({
                event:     'chat:rooms',
                chatrooms: chatrooms
            });
        });
    });

    // Get the list of last messages
    Dispatcher.register('chat:messages:last', 'USER', function getLastMessages(spark, data, team, user) {
        var chatroom = data.chatroom;
        var count    = data.count || 20;

        if(!chatroom) {
            return;
        }

        ChatroomStore.getLastMessages(team, chatroom, count, function(err, messages) {
            spark.write({
                event:    'chat:messages',
                chatroom: chatroom,
                messages: messages
            });
        });
    });

    // Get the list of messages
    Dispatcher.register('chat:messages', 'USER', function getMessages(spark, data, team, user) {
        var chatroom = data.chatroom;
        var last     = data.last;
        var count    = data.count || 20;

        if(!chatroom || !last) {
            return;
        }

        ChatroomStore.getMessages(team, chatroom, last, count, function(err, messages) {
            spark.write({
                event:    'chat:messages',
                chatroom: chatroom,
                messages: messages
            });
        });
    });

    // Subscribe to the chatroom
    Dispatcher.register('chat:subscribe', 'USER', function subscribe(spark, data, team, user) {

        // List all chatroom then subscribe
        ChatroomStore.getChatrooms(team, function(err, chatrooms) {
            if(err) {
                return;     
            }

            var identifier = app.identifier();

            // Subscribe to all
            chatrooms.forEach(function(chatroom) {
                SubscriptionStore.create(identifier, team, user, chatroom);
            });
        });
    });

    Dispatcher.reset();
};
