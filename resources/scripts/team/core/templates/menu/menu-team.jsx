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
                apps_label: 'Apps',
                settings:   'Paramètres'
            }
        };
    },

    render: function() {
        var applications = TeamStore.getTeam().applications || [];

        return (
            <div className="sidr-left bg-blue-grey">
                <div className="sl-wrapper">    
                    <MenuLabel icon="fa-th" label={this.props.text.apps_label} />
                        
                    <ul className="sl-list">
                        {applications.map(function(application) {
                            var identifier = application.identifier;

                            return <MenuTeamItem key={'menu-team-' + identifier} application={application} />
                        })}
                        
                        <If test={UserStore.isAdmin()}>
                            <li className="settings">
                                <Link href="#/team/settings">
                                    <i className="fa fa-cog"></i>{this.props.text.settings}
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