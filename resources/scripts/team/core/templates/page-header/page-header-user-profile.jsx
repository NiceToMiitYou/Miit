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

            }
        };
    },

    render: function() {

    	var user = UserStore.getUser();
        var name = UserStore.getName(user);

        return (
        	<span className="miit-component user-profile">
                <UserAvatar user={user} />
                
                <span className="username">
                    {name}
                </span>

                <span className="pull-right"><i className="fa fa-angle-down ml10"></i></span>
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