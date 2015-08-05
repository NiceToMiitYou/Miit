'use strict';

// Include requirements
var PageStore = require('core/stores/page-store');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

// Include components
var UserLogin = require('core/templates/user/user-login.jsx');

var Login = React.createClass({
    getDefaultProps: function () {
        return {
            title: 'Connexion'
        };
    },

    render: function() {
        return (
            <Layout title={this.props.title}>
                <UserLogin />
            </Layout>
        );
    }
});

PageStore.registerMainPage('login', Login);

module.exports = Login;