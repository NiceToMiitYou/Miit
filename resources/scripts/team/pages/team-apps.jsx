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
var NotFound        = require('./not-found.jsx'),
    Link            = require('core/templates/components/link.jsx'),
    ApplicationList = require('core/templates/team/application-list.jsx'),
    AppStoreList    = require('core/templates/app-store/app-store-list.jsx');

var TeamApps = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                applications: 'Applications',
                informations: 'Informations',
                appstore:     'Ajouter une application', 
                applist:      'Liste des applications', 
                title:        'Configuration', 
                subtitle:     'Configurer les applications présentes sur votre Miit',
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
                        <Link href="#/team/settings" className="col-xs-12 col-md-4">
                            <i className="fa fa-cogs mr15"></i> {this.props.text.menu.settings}
                        </Link>
                        <Link href="#/team/users" className="col-xs-12 col-md-4">
                            <i className="fa fa-users mr15"></i> {this.props.text.menu.users}
                        </Link>
                        <Link href="#/team/apps" className="col-xs-12 col-md-4 active">
                            <i className="fa fa-th mr15"></i> {this.props.text.menu.apps}
                        </Link>
                    </div>

                    <Panel icon="th" title={this.props.text.applications}>
                        <h3 className="mb20">{this.props.text.applist} </h3>
                        <ApplicationList />

                        <h3 className="mb20 mt30">{this.props.text.appstore} </h3>
                        <AppStoreList />
                        
                        <div className="clearfix"></div>
                    </Panel>
                </div>
            </Layout>
        );
    }
});

PageStore.registerApplicationPage('team', 'apps', TeamApps);

module.exports = TeamApps;
