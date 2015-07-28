'use strict';

// Include requirements
var PageStore = require('core/stores/page-store'),
    TeamStore = require('core/stores/team-store');

// Include Layout
var Layout = require('./layouts/user-list-layout.jsx');

// Include components
var Login    = require('./login.jsx'),
    ChatApp  = require('templates/application/apps/chat/chat-app.jsx');

var ChatPage = React.createClass({
    getDefaultProps: function () {
        return {
            title: 'Chat'
        };
    },

    render: function() {
        if(false === TeamStore.hasApplication('APP_CHAT')) {
            return <Login />;
        }

        return (
            <Layout title={this.props.title}>
                <ChatApp />
            </Layout>
        );
    }
});

PageStore.registerMainPage('chat', (<ChatPage />));

module.exports = ChatPage;
