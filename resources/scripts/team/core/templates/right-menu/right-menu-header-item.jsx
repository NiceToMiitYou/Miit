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

var RightMenuHeaderItem = React.createClass({
    getDefaultProps: function () {
        return {
            text: {

            },
            tab: {
                id: 1,
                icon: 'users'
            }
        };
    },

    _onClick: function() {
        if (typeof this.props.setCurrent === 'function') {
            this.props.setCurrent(this.props.tab.id);
        };
    },

    render: function() {

        var icon      = classNames('fa', 'fa-'+this.props.tab.icon);
        var className = classNames((true === this.props.active) ? 'active' : '', 'miit-component');

        return (
        	<li className={className} onClick={this._onClick}>
                <i className={icon}></i>
            </li>
        );
    }
});

module.exports = RightMenuHeaderItem;