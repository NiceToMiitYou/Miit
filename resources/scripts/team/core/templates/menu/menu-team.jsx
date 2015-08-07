'use strict';

// Include requirements
var UserStore    = require('core/stores/user-store'),
    UserActions  = require('core/actions/user-actions'),
    ModalActions = require('core/actions/modal-actions'),
    TeamStore    = require('core/stores/team-store');

// Include common
var If   = require('templates/if.jsx');

// Include templates
var Link            = require('core/templates/components/link.jsx'),
    UserList        = require('core/templates/user/user-list.jsx')
    UserSettings    = require('pages/user-settings.jsx'),
    MenuHeader      = require('./menu-header.jsx'),
    MenuLabel       = require('./menu-label.jsx'),
    MenuUserProfile = require('./menu-user-profile.jsx'),
    MenuTeamItem    = require('./menu-team-item.jsx');

var MenuTeam = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                user_label:      'Utilisateurs',
                my_account:      'Mon compte',
                disconnect:      'Déconnexion',
                connect:         'Connexion',
                apps_label:      'Applications',
                add_application: 'Ajouter une App',
                add_user:        'Ajouter un utilisateur'
            }
        };
    },

    openAppStore: function() {
        ModalActions.open('user-settings', <UserSettings />, {
            title:  this.props.text.my_account,
            color : 'grey',
            size :  'medium'
        });
    },

    render: function() {
        var applications = TeamStore.getTeam().applications || [];

        return (
            <div className="sidr-left bg-blue-grey">
                <div className="sl-wrapper">
                    <MenuHeader />

                    <If test={TeamStore.hasApplications() || UserStore.isAdmin()}>
                        <MenuLabel label={this.props.text.apps_label} />
                    </If>
                        
                    <ul className="sl-list">
                        {applications.map(function(application) {
                            var identifier = application.identifier;

                            return <MenuTeamItem key={'menu-team-' + identifier} application={identifier} />
                        })}
                        
                        <If test={UserStore.isAdmin()}>
                            <li>
                                <Link href="#/settings">
                                    <i className="fa fa-plus pull-left"></i> {this.props.text.add_application}
                                </Link>
                            </li>
                        </If>
                    </ul>

                    <MenuLabel label={this.props.text.user_label} />
                    <MenuUserProfile />

                    <span onClick={this.openAppStore}>
                        <i className="fa fa-plus pull-left"></i> {this.props.text.my_account}
                    </span>
                    
                    <UserList headers={false} invite={false} roles={false} emails={false} filtered={false} status={true} me={false} />
                    <If test={UserStore.isAdmin()}>
                        <ul className="sl-list">
                            <li>
                                <Link href="#/settings">
                                    <i className="fa fa-user-plus pull-left"></i> {this.props.text.add_user}
                                </Link>
                            </li>
                        </ul>
                    </If>
                </div>
            </div>
        );
    }
});

module.exports = MenuTeam;