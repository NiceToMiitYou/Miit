'use strict';

// Include requirements
var PageStore = MiitApp.require('core/stores/page-store'),
    TeamStore = MiitApp.require('core/stores/team-store');

// Include Layout
var Layout = MiitApp.require('pages/layouts/default-layout.jsx');

// Include core components
var Login = MiitApp.require('pages/login.jsx');

// Include components
var DocumentsApp = require('templates/documents-app.jsx');

var DocumentsPage = React.createClass({
    getDefaultProps: function () {
        return {
            title: 'Documents'
        };
    },

    render: function() {
        if(false === TeamStore.hasApplication('APP_DOCUMENTS')) {
            return <Login />;
        }

        return (
            <Layout title={this.props.title}>
                <DocumentsApp />
            </Layout>
        );
    }
});

PageStore.registerMainPage('documents', DocumentsPage);

module.exports = DocumentsPage;
