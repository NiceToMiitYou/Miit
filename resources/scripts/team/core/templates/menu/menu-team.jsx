'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    UserActions = require('core/actions/user-actions'),
    UserList    = require('core/templates/user/user-list.jsx'),
    TeamStore   = require('core/stores/team-store');

// Include common
var If   = require('templates/if.jsx');

// Include components
var Link = require('core/templates/components/link.jsx'),
    MenuHeader      = require('./menu-header.jsx'),
    MenuLabel       = require('./menu-label.jsx'),
    MenuUserProfile = require('./menu-user-profile.jsx'),
    Clock           = require('templates/clock.jsx'),
    MenuTeamItem    = require('./menu-team-item.jsx');

var MenuTeam = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                user_label:      'Utilisateurs',
                my_account:      'Mon compte',
                disconnect:      'Déconnexion',
                connect:         'Connexion',
                apps_label:      'Apps',
                add_application: 'Ajouter'
            }
        };
    },

    render: function() {
        var applications = TeamStore.getTeam().applications || [];

        return (
            <div className="sidr-left bg-blue-grey">
                <div className="sl-wrapper">
                    

                    <If test={TeamStore.hasApplications() || UserStore.isAdmin()}>
                        <MenuLabel icon="fa-th" label={this.props.text.apps_label} />
                    </If>
                        
                    <ul className="sl-list">
                        {applications.map(function(application) {
                            var identifier = application.identifier;

                            return <MenuTeamItem key={'menu-team-' + identifier} application={application} />
                        })}
                        
                        <If test={UserStore.isAdmin()}>
                            <li className="add-application">
                                <Link href="#/settings">
                                    <i className="fa fa-plus"></i>{this.props.text.add_application}
                                </Link>
                            </li>
                        </If>
                    </ul>
                </div>
                <Clock />
            </div>
        );
    }
});

module.exports = MenuTeam;