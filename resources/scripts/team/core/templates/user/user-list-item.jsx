'use strict';

// Include requirements
var UserStore       = require('core/stores/user-store'),
    UserStatusStore = require('core/stores/user-status-store');

// Include common
var If = require('templates/if.jsx');

// Include components
var UserAvatar        = require('./user-avatar.jsx'),
    UserListItemRoles = require('./user-list-item-roles.jsx');


var UserListItem = React.createClass({
    getDefaultProps: function() {
        return {
            user: {
                id:    '',
                name:  'unknow',
                roles: []
            },
            email: true,
            roles: true,
            status: false
        };
    },

    componentDidMount: function() {
        UserStatusStore.addStatusChangedListener(this._onChanged);
    },

    componentWillUnmount: function() {
        UserStatusStore.removeStatusChangedListener(this._onChanged);
    },

    _onChanged: function() {
        this.forceUpdate();
    },

    render: function() {
        var classes;
        var name   = UserStore.getName(this.props.user);

        if(this.props.status) {
            var userId = this.props.user.id;
            var status = UserStatusStore.getUserStatusByUserId(userId);

            classes = classNames('status pl10', status.toLowerCase());
        }

        return (
            <div className="miit-component user-list-item">
                <UserAvatar user={this.props.user} />
                <span className="pl10">
                    {name}
                    <If test={this.props.status}>
                        <span className={classes}><i className="fa fa-circle"></i></span>
                    </If>
                </span>
                
                <If test={this.props.email && UserStore.isUser()}>
                    <span className="pl10">{this.props.user.email}</span>
                </If>
                
                <If test={this.props.roles && UserStore.isAdmin()}>
                    <UserListItemRoles user={this.props.user}/>
                </If>
            </div>
        );
    }
});

module.exports = UserListItem;
