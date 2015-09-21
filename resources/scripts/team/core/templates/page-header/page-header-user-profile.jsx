'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    UserActions = require('core/actions/user-actions'),
    TeamStore   = require('core/stores/team-store'),
    PageActions = require('core/actions/page-actions');

// Include common
var If   = require('templates/if.jsx');

// Include components
var Link 	   = require('core/templates/components/link.jsx'),
    UserAvatar = require('core/templates/user/user-avatar.jsx'),
	Clock      = require('templates/clock.jsx');

var PageHeaderUserProfile = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                account: 'Mon compte',
                logout:  'Deconnexion',
                connect: 'Connexion'
            }
        };
    },

    getInitialState: function () {
        return {
            dropdown: false  
        };
    },

    openDropdown: function() {
        var stat = this.state.dropdown;

        this.setState({
            dropdown: !stat
        });
    },

    _onLeave: function() {
        if(this.isMounted()) {
            this.setState({
                dropdown: false
            });
        }
    },

    onLeave: function() {
        this.timeoutId = setTimeout(this._onLeave, 500);
    },

    onEnter: function() {
        clearTimeout(this.timeoutId);
    },

    render: function() {

    	var user = UserStore.getUser();
        var name = UserStore.getName(user);

        var className = classNames('miit-component', 'user-profile', (true === this.state.dropdown) ? 'active' : '');

        return (
        	<span className={className} onClick={this.openDropdown} onMouseLeave={this.onLeave} onMouseEnter={this.onEnter} >
                <UserAvatar user={user} />
                
                <span className="username">
                    {name}
                </span>

                <span className="pull-right"><i className="fa fa-angle-down ml10"></i></span>

                <If test={this.state.dropdown}>
                    <div className="user-dropdown">

                        <If test={!UserStore.isAnonym()}>
                            <ul>
                                <li>
                                    <Link href="#/me">
                                        <i className="fa fa-user mr10 ml5"></i>{this.props.text.account}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#/logout" onLinkClick={UserActions.logout} className="sl-logout">
                                        <i className="fa fa-power-off mr10 ml5"></i>{this.props.text.logout}
                                    </Link>
                                </li>
                            </ul>
                        </If>

                        <If test={UserStore.isAnonym()}>
                            <ul>
                                <li>
                                    <Link href="#/login" className="sl-login">
                                        <i className="fa fa-power-off ml5 mr10"></i>{this.props.text.connect}
                                    </Link>
                                </li>
                            </ul>
                        </If>

                    </div>
                </If>
            </span>
        );
    }
});

module.exports = PageHeaderUserProfile;

// <If test={UserStore.isUser()}>
//     <Link href="#/me" className="pull-right mr10 text-white">
//         <i className="fa fa-cog pull-left"></i>
//     </Link>
// </If>