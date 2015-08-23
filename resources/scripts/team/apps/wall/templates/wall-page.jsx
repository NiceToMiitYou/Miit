'use strict';

// Include requirements
var PageStore = MiitApp.require('core/stores/page-store'),
    TeamStore = MiitApp.require('core/stores/team-store');

// Include Layout
var Layout = MiitApp.require('pages/layouts/default-layout.jsx');

// Include core components
var Login = MiitApp.require('pages/login.jsx');

// Include components
var WallApp = require('templates/wall-app.jsx');

var WallPage = React.createClass({
    getDefaultProps: function () {
        return {
            title: 'Wall'
        };
    },

    render: function() {
        if(false === TeamStore.hasApplication('APP_WALL')) {
            return <Login />;
        }

        return (
            <Layout title={this.props.title} fullheight={true}>
                <WallApp />
            </Layout>
        );
    }
});

PageStore.registerMainPage('wall', WallPage);

module.exports = WallPage;
