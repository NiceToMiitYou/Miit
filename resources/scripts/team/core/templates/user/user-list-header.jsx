'use strict';

// Include requirements
var UserStore = require('core/stores/user-store');

// Include common
var If = require('templates/if.jsx');

var UserListHeader = React.createClass({
    getDefaultProps: function() {
        return {
            text: {
                avatar: 'Avatar',
                name:   'Nom',
                email:  'Email',
                action: 'Action'
            },
            email: true,
            roles: true
        };
    },

    render: function() {
        return (
            <div className="miit-component user-list-header">
                <span>{this.props.text.avatar}</span>
                <span>{this.props.text.name}</span>
                <If test={this.props.email && UserStore.isUser()}>
                    <span>{this.props.text.email}</span>
                </If>
                <If test={this.props.roles && UserStore.isAdmin()}>
                    <span>{this.props.text.action}</span>
                </If>
            </div>
        );
    }
});

module.exports = UserListHeader;