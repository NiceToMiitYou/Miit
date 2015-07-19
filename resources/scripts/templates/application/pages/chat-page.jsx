'use strict';

// Include requirements
var PageStore = require('application/stores/page-store');

// Include Layout
var Layout = require('./layouts/default.jsx');

// Include components
var UserList = require('templates/application/components/user/user-list.jsx'),
    ChatApp  = require('templates/application/components/chat/chat-app.jsx');

var ChatPage = React.createClass({
    getDefaultProps: function () {
        return {
            title: 'Chat',
            text: {
                users: 'Utilisateurs'
            }
        };
    },

    render: function() {
        return (
            <Layout title={this.props.title}>
                <ChatApp />
                <div className="sidr-right">
                    <span className="sr-label">{this.props.text.users}</span>
                    <UserList headers={false} invite={false} roles={false} emails={false} filtered={false} status={true} />
                </div>
            </Layout>
        );
    }
});

PageStore.registerMainPage('chat', (<ChatPage />));
