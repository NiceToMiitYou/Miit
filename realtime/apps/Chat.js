'use strict';

module.exports = function ChatApp() {
    var app = this;

    var ChatroomStore = miitoo.get('ChatroomStore');
    //var UserManager   = miit.managers.UserManager;

    function onCreateChatroom(spark, user, team) {
        spark.on('chat:room:create', function(data) {
            ChatroomStore.create(team, data.name, function(err, chatroom) {
                sendChatrooms(spark, user, team);
            });
        });
    }

    function onSendMessage(spark, user, team) {
        spark.on('chat:message', function(data) {
            ChatroomStore.send(team, user, data.chatroom, data.text, function(err, message) {
                var room = team._id + ':' + app.identifier();

                primus.in(room).write({
                    event: 'chat:message',
                    chatroom: data.chatroom,
                    message:  message
                });
            });
        });
    }

    function sendChatrooms(spark, user, team) {
        ChatroomStore.getChatrooms(team, function(err, chatrooms) {
            spark.write({
                event: 'chat:rooms',
                chatrooms: chatrooms
            });
        });
    }

    this.onConnection = function(spark, user, team) {
        onSendMessage(spark, user, team);
        sendChatrooms(spark, user, team);

        if(UserManager.isAdmin(user)) {
            onCreateChatroom(spark, user, team);
        }
    };

    this.onDisconnection = function(spark, user, team) {

    };

    this.identifier = function() {
        return 'APP_CHAT';
    }
};
