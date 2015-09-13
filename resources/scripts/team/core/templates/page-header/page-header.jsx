'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    UserActions = require('core/actions/user-actions'),
    TeamStore   = require('core/stores/team-store'),
    PageActions = require('core/actions/page-actions');

// Include common
var If   = require('templates/if.jsx');

// Include components
var Link 					= require('core/templates/components/link.jsx'),
    PageHeaderUserProfile   = require('./page-header-user-profile.jsx');

var PageHeader = React.createClass({
    getDefaultProps: function () {
        return {
            text: {

            }
        };
    },

    render: function() {

    	var team = TeamStore.getTeam();

        return (
        	<div className="page-header miit-component">
        	    <a className="minimize-menu" onClick={PageActions.toggleLeftMenu}>
        	        <i className="fa fa-bars"></i>
        	    </a>
        	    <h1>{team.name}</h1>

        	    <div className="pull-right">
        	    	<PageHeaderUserProfile />
        	    	<span className="toggle-menu-right" onClick={PageActions.toggleRightMenu}>
        	    		<i className="fa fa-align-right"></i>
        	    	</span>
        	    </div>
        	</div>
        );
    }
});

module.exports = PageHeader;