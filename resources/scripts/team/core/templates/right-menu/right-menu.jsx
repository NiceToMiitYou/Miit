'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    UserActions = require('core/actions/user-actions'),
    TeamStore   = require('core/stores/team-store'),
    UserList    = require('core/templates/user/user-list.jsx'),
    PageActions = require('core/actions/page-actions');

// Include common
var If   = require('templates/if.jsx');

// Include components
var Link 		         = require('core/templates/components/link.jsx'),
    RightMenuHeader      = require('./right-menu-header.jsx'),
    RightMenuUserList    = require('./right-menu-user-list.jsx');

var RightMenu = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                
            },

            tabs: [
                {
                    id:   1,
                    icon: 'users'
                }/**,
                {
                    id:   2,
                    icon: 'bell'
                },
                {
                    id:   3,
                    icon: 'envelope'
                }**/
            ]
        };
    },

    getInitialState: function () {
        return {
            current: 1
        };
    },

    setCurrent: function(current) {
        this.setState({
            current: current
        });
    },

    _onLeave: function() {
        PageActions.toggleRightMenu();
    },

    onLeave: function() {
        this.timeoutId = setTimeout(this._onLeave, 200);
    },

    onEnter: function() {
        clearTimeout(this.timeoutId);
    },

    render: function() {

    	var team = TeamStore.getTeam();

        return (
        	<div className="sidr-right bg-blue-grey miit-component" onMouseLeave={this.onLeave} onMouseEnter={this.onEnter}>

                <RightMenuHeader current={this.state.current} tabs={this.props.tabs} setCurrent={this.setCurrent}/>

                <RightMenuUserList id={1} current={this.state.current} />
        	
            </div>
        );
    }
});

module.exports = RightMenu;