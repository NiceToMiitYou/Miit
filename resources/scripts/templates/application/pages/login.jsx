
// Include requirements
var PageStore = require('../../../application/stores/page-store');

// Include Layout
var Layout = require('./layouts/default.jsx');

// Include components
var UserLogin = require('../components/user/user-login.jsx');

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

PageStore.registerMainPage('login', (<Login />));
