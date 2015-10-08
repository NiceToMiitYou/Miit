'use strict';

// Include requirements
var PageStore = require('core/stores/page-store'),
    UserStore = require('core/stores/user-store'),
    TeamStore = require('core/stores/team-store');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

// Include common
var Panel = require('templates/panel.jsx');

// Include components
var NotFound = require('./not-found.jsx'),
    UserList = require('core/templates/user/user-list.jsx');

var TeamUsers = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                applications: 'Applications',
                informations: 'Informations',
                userlist:     'Liste des utilisateurs',
                title:        'Configuration',
                subtitle:     'Gérer les utilisateurs de votre Miit',
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
            <Layout>
                <div className="container-fluid mb20">
                    <div className="page-title">
                        <h2>
                            <i className="fa fa-cogs pull-left mr15"></i> {this.props.text.title} 
                            <span className="subtitle">{this.props.text.subtitle}</span>
                        </h2>
                    </div>

                    <Panel icon="users" title={this.props.text.users}>
                        <h3 className="mb20">{this.props.text.userlist}</h3>   
                        <UserList autoload={true} headers={false} status={true}/>
                    </Panel>
                </div>
            </Layout>
        );
    }
});

PageStore.registerApplicationPage('team', 'users', TeamUsers);

module.exports = TeamUsers;
