'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    UserActions = require('core/actions/user-actions'),
    TeamStore   = require('core/stores/team-store');

// Include common
var If   = require('templates/if.jsx');

// Include components
var Link = require('core/templates/components/link.jsx'),
    MenuHeader      = require('./menu-header.jsx'),
    MenuLabel       = require('./menu-label.jsx'),
    MenuUserProfile = require('./menu-user-profile.jsx'),
    MenuTeamItem    = require('./menu-team-item.jsx');

var MenuTeam = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                user_label:      'Utilisateur',
                my_account:      'Mon compte',
                disconnect:      'Déconnexion',
                connect:         'Connexion',
                apps_label:      'Applications',
                add_application: 'Ajouter une App'
            }
        };
    },

    render: function() {
        return (
            <div className="sidr-left bg-blue-grey">
                <div className="sl-wrapper">
                    <MenuHeader />
                    
                    <MenuLabel label={this.props.text.user_label} />
                    <MenuUserProfile />

                    <ul className="sl-list mb10">
                        <If test={!UserStore.isAnonym()}>
                            <li>
                                <Link href="#/me" activeGroup="menu-team" activeName="me">
                                    <i className="fa fa-cogs pull-left"></i> {this.props.text.my_account}
                                </Link>
                            </li>
                        </If>
                        <If test={!UserStore.isAnonym()}>
                            <li>
                                <Link href="#/logout" onLinkClick={UserActions.logout}>
                                    <i className="fa fa-sign-out pull-left"></i> {this.props.text.disconnect}
                                </Link>
                            </li>
                        </If>
                        <If test={UserStore.isAnonym()}>
                            <li>
                                <Link href="#/login">
                                    <i className="fa fa-sign-in pull-left"></i> {this.props.text.connect}
                                </Link>
                            </li>
                        </If>
                    </ul>

                    <If test={TeamStore.hasApplications() || UserStore.isAdmin()}>
                        <MenuLabel label={this.props.text.apps_label} />
                    </If>
                        
                    <ul className="sl-list">
                        <MenuTeamItem application="APP_CHAT"      label="Chat"      link="#/chat"      activeName="chat" />
                        <MenuTeamItem application="APP_QUIZZ"     label="Quizz"     link="#/quizz"     activeName="quizz" />
                        <MenuTeamItem application="APP_DOCUMENTS" label="Documents" link="#/documents" activeName="documents" />
                        <If test={UserStore.isAdmin()}>
                            <li>
                                <Link href="#/settings">
                                    <i className="fa fa-plus pull-left"></i> {this.props.text.add_application}
                                </Link>
                            </li>
                        </If>
                    </ul>

                </div>
            </div>
        );
    }
});

module.exports = MenuTeam;