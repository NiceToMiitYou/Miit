'use strict';

// Include requirements
var PageStore = MiitApp.require('core/stores/page-store'),
    TeamStore = MiitApp.require('core/stores/team-store');

// Include Layout
var Layout = MiitApp.require('pages/layouts/default-layout.jsx');

// Include core components
var Login = MiitApp.require('pages/login.jsx');

// Include components
var ChatApp = require('templates/chat-app.jsx');

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
