'use strict';

// Include requirements
var PageStore = require('application/stores/page-store'),
    UserStore = require('application/stores/user-store'),
    TeamStore = require('application/stores/team-store');

// Include Layout
var Layout = require('./layouts/default.jsx');

// Include common
var Panel = require('templates/common/panel.jsx');

// Include components
var NotFound        = require('./not-found.jsx'),
    UserList        = require('templates/application/components/user/user-list.jsx'),
    TeamUpdate      = require('templates/application/components/team/team-update.jsx'),
    ApplicationList = require('templates/application/components/team/application-list.jsx');

var TeamSettings = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                applications: 'Applications',
                informations: 'Informations',
                users:        'Utilisateurs'
            }
        };
    },

    componentDidMount: function() {
        TeamStore.addTeamUpdatedListener(this._onChange);
    },

    componentWillUnmount: function() {
        TeamStore.removeTeamUpdatedListener(this._onChange);
    },

    _onChange: function() {
        this.forceUpdate();
    },

    render: function() {
        if(false === UserStore.isAdmin()) {
            return <NotFound />;
        }

        var team = TeamStore.getTeam();

        return (
            <Layout title={team.name}>
                <Panel icon="info" title={this.props.text.informations}>
                    <TeamUpdate />
                </Panel>

                <Panel icon="th" title={this.props.text.applications}>
                    <ApplicationList />
                </Panel>

                <Panel icon="users" title={this.props.text.users}>
                    <UserList autoload={true} />
                </Panel>
            </Layout>
        );
    }
});

PageStore.registerMainPage('settings', (<TeamSettings />));

module.exports = TeamSettings;
