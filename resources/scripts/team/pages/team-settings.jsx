'use strict';

// Include requirements
var PageStore    = require('core/stores/page-store'),
    ModalActions = require('core/actions/modal-actions'),
    ModalStore   = require('core/stores/modal-store'),
    UserStore    = require('core/stores/user-store'),
    TeamStore    = require('core/stores/team-store');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

// Include common
var Panel = require('templates/panel.jsx');

// Include components
var NotFound        = require('./not-found.jsx'),
    UserList        = require('core/templates/user/user-list.jsx'),
    TeamUpdate      = require('core/templates/team/team-update.jsx'),
    ApplicationList = require('core/templates/team/application-list.jsx'),
    AppStoreList    = require('core/templates/app-store/app-store-list.jsx');

var TeamSettings = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                applications: 'Applications',
                informations: 'Informations',
                userlist:     'Liste des utilisateurs', 
                appstore:     'Ajouter une application', 
                applist:      'Liste des applications', 
                title:        'Configuration', 
                subtitle:     'Configurer les informations et la confidentialité de votre miit', 
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

    openAppStore: function() {
        ModalActions.open('app-store', <AppStoreList />, {
            title:  'App store',
            color : 'grey',
            size :  'medium'
        });
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

                <div className="container-fluid">

                    <h2 className="mt30">
                        <i className="fa fa-cogs pull-left mr15"></i> {this.props.text.title} 
                        <span className="subtitle">{this.props.text.subtitle}</span>
                    </h2>

                    <Panel icon="info" title={this.props.text.informations}>
                        <TeamUpdate />
                    </Panel>

                    <Panel icon="th" title={this.props.text.applications}>
                        <h3 className="mb20">{this.props.text.applist} </h3>
                        <ApplicationList />

                        <h3 className="mb20 mt30">{this.props.text.appstore} </h3>
                        <button className="btn btn-info" onClick={this.openAppStore}>
                            Application Store
                        </button>
                    </Panel>

                    <Panel icon="users" title={this.props.text.users}>
                        <h3 className="mb20">{this.props.text.userlist} </h3>   
                        <UserList autoload={true} headers={false} status={true}/>
                    </Panel>
                </div>
            </Layout>
        );
    }
});

PageStore.registerMainPage('settings', TeamSettings);

module.exports = TeamSettings;
