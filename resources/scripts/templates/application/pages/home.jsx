
// Include requirements
var PageStore = require('../../../application/stores/page-store');

// Include Layout
var Layout = require('./layouts/default.jsx');

// Include components
var UserList = require('../components/user/user-list.jsx');

var Home = React.createClass({
    getDefaultProps: function () {
        return {
            title: 'Welcome',
            text: {
                users: 'Utilisateurs'
            }
        };
    },

    render: function() {
        return (
            <Layout title={this.props.title}>
                <div className="sidr-right">
                    <span className="sr-label">{this.props.text.users}</span>
                    <UserList headers={false} invite={false} roles={false} emails={false} filtered={false} status={true} />
                </div>
            </Layout>
        );
    }
});

PageStore.registerMainPage('home', (<Home />));
