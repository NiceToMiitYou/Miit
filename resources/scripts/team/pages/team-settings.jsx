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
var Default    = require('./default.jsx'),
    NotFound   = require('./not-found.jsx'),
    Link       = require('core/templates/components/link.jsx'),
    TeamUpdate = require('core/templates/team/team-update.jsx');

var TeamSettings = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                applications: 'Applications',
                informations: 'Informations',
                title:        'Configuration', 
                subtitle:     'Configurer les informations et la confidentialité de votre Miit',
                menu: {
                    settings: 'Informations',
                    apps:     'Applications',
                    users:    'Utilisateurs'
                }
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

                    <div className="team-menu row">
                        <Link href="#/team/settings" className="col-xs-12 col-md-4 active">
                            <i className="fa fa-cogs mr15"></i> {this.props.text.menu.settings}
                        </Link>
                        <Link href="#/team/users" className="col-xs-12 col-md-4">
                            <i className="fa fa-users mr15"></i> {this.props.text.menu.users}
                        </Link>
                        <Link href="#/team/apps" className="col-xs-12 col-md-4">
                            <i className="fa fa-th mr15"></i> {this.props.text.menu.apps}
                        </Link>
                    </div>

                    <Panel icon="info" title={this.props.text.informations}>
                        <TeamUpdate />
                    </Panel>
                </div>
            </Layout>
        );
    }
});

// Load default pages
PageStore.registerMainPage('team', Default('team'));

PageStore.registerApplicationPage('team', 'settings', TeamSettings);

module.exports = TeamSettings;
