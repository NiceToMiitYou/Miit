'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    UserActions = require('core/actions/user-actions'),
    TeamStore   = require('core/stores/team-store'),
    PageActions = require('core/actions/page-actions');

// Include common
var If   = require('templates/if.jsx');

// Include components
var Link = require('core/templates/components/link.jsx');

var RightMenuLabel = React.createClass({
    getDefaultProps: function () {
        return {
            text: {

            }
        };
    },

    render: function() {

    	var team = TeamStore.getTeam();
        var icon = classNames('fa', this.props.icon, 'mr5');

        return (
        	<div className="sr-label miit-component">
                <i className={icon}></i>
        	    {this.props.label}
        	</div>
        );
    }
});

module.exports = RightMenuLabel;