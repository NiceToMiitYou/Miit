'use strict';

// Include requirements
var UserStatusStore   = require('core/stores/user-status-store'),
    UserStatusActions = require('core/actions/user-status-actions'),
    UserStore         = require('core/stores/user-store'),
    TeamStore         = require('core/stores/team-store'),
    TeamActions       = require('core/actions/team-actions');

// Include common
var If      = require('templates/if.jsx'),
    Loading = require('templates/loading.jsx');

// Include components
var UserListHeader = require('./user-list-header.jsx'),
    UserListItem   = require('./user-list-item.jsx'),
    UserListInvite = require('./user-list-invite.jsx');

var UserList = React.createClass({
    getDefaultProps: function() {
        return {
            users:    [],
            loading:  'Chargement...',
            loader:   true,
            headers:  true,
            invite:   true,
            roles:    true,
            emails:   true,
            filtered: true,
            status:   false,
            me:       true
        };
    },

    getInitialState: function() {
        return {
            users:  [],
            loaded: false
        };
    },

    componentWillMount: function() {
        var list = UserStatusStore.getUsers(this.props.filtered);

        if(false === this.props.me) {
            list.removeBy('id', UserStore.getUser().id);
        }

        this.setState({
            users: list.sortBy('name')
        });
    },

    componentDidMount: function() {
        // Invited
        TeamStore.addInvitedListener(this._refresh);
        // Promoted
        TeamStore.addPromotedListener(this._refresh);
        // Demoted
        TeamStore.addDemotedListener(this._refresh);
        // Removed
        TeamStore.addRemovedListener(this._refresh);
        // Refresh
        TeamStore.addRefreshedListener(this._refresh);
        // LoggedIn
        UserStore.addLoggedInListener(this._refresh);
        // Status Changed
        UserStatusStore.addStatusChangedListener(this._refresh);
        // Refresh the list
        TeamActions.refresh();
    },

    componentWillUnmount: function() {
        // Invited
        TeamStore.removeInvitedListener(this._refresh);
        // Promoted
        TeamStore.removePromotedListener(this._refresh);
        // Demoted
        TeamStore.removeDemotedListener(this._refresh);
        // Removed
        TeamStore.removeRemovedListener(this._refresh);
        // Refresh
        TeamStore.removeRefreshedListener(this._refresh);
        // LoggedIn
        UserStore.removeLoggedInListener(this._refresh);
        // Status Changed
        UserStatusStore.removeStatusChangedListener(this._refresh);
    },

    _refresh: function() {
        if(this.isMounted()) {
            var list = UserStatusStore.getUsers(this.props.filtered);
            
            if(false === this.props.me) {
                list.removeBy('id', UserStore.getUser().id);
            }

            this.setState({
                users:  list.sortBy('name'),
                loaded: true
            });
        }
    },

    render: function() {
        return (
            <div className="miit-component user-list">
                <If test={this.props.headers}>
                    <UserListHeader email={this.props.emails} roles={this.props.roles} />
                </If>
                {this.state.users.map(function(user) {
                    return <UserListItem key={user.id} user={user} email={this.props.emails} roles={this.props.roles} status={this.props.status} />;
                }, this)}
                <If test={!this.state.loaded && this.props.loader}>
                    <Loading />
                </If>
                <If test={this.props.invite}>
                    <UserListInvite onInvite={this.allowRefresh} />
                </If>
            </div>
        );
    }
});

module.exports = UserList;