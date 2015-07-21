'use strict';

module.exports = function ChatApp() {
    this.identifier = function() {
        return 'APP_CHAT';
    }

    var app = this;

    var ChatroomStore     = miitoo.get('ChatroomStore');
    var SubscriptionStore = miitoo.get('SubscriptionStore');

    var primus     = miitoo.get('Primus');
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    function sendRooms(team) {
        // Send the list of chatrooms
        ChatroomStore.getChatrooms(team, function(err, chatrooms) {
            var room = team._id + ':' + app.identifier();

            // Send the informations to the whole app user
            primus.in(room).write({
                event:     'chat:rooms',
                chatrooms: chatrooms
            });
        });
    }

    // Create a chatroom
    Dispatcher.register('chat:create', 'ADMIN', app.identifier(), function onCreateChatroom(spark, data, team, user) {
        var name = data.name;

        if(!name) {
            return;
        }

        ChatroomStore.create(team, name, function(err, chatroom) {
            sendRooms(team);
        });
    });

    // Delete a chatroom
    Dispatcher.register('chat:delete', 'ADMIN', app.identifier(), function onCreateChatroom(spark, data, team, user) {
        var chatroom = data.chatroom;

        if(!chatroom) {
            return;
        }

        ChatroomStore.delete(team, chatroom, function(err) {
            sendRooms(team);
        });
    });

    // Send a message
    Dispatcher.register('chat:send', 'USER', app.identifier(), function onSendMessage(spark, data, team, user) {
        var chatroom = data.chatroom;
        var text     = data.text;

        if(!chatroom || !text) {
            return;
        }

        ChatroomStore.send(team, user, chatroom, text, function(err, message) {
            var identifier = app.identifier();

            var room = team._id + ':' + identifier;

            primus.in(room).write({
                event:    'chat:message',
                chatroom: chatroom,
                message:  message
            });

            SubscriptionStore.increment(identifier, team, user, chatroom);
        });
    });

    // Get the list of chatrooms
    Dispatcher.register('chat:rooms', 'USER', app.identifier(), function sendChatrooms(spark, data, team, user) {
        ChatroomStore.getChatrooms(team, function(err, chatrooms) {
            spark.write({
                event:     'chat:rooms',
                chatrooms: chatrooms
            });
        });
    });

    // Get the list of last messages
    Dispatcher.register('chat:messages:last', 'USER', app.identifier(), function getLastMessages(spark, data, team, user) {
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
    Dispatcher.register('chat:messages', 'USER', app.identifier(), function getMessages(spark, data, team, user) {
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
    Dispatcher.register('chat:subscribe', 'USER', app.identifier(), function subscribe(spark, data, team, user) {

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
};
