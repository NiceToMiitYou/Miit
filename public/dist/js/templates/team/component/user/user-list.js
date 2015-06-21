(function(){
    var TeamStore, TeamActions, UserStatusStore, UserStatusActions;

    MiitComponents.UserList = React.createClass({displayName: "UserList",
        getDefaultProps: function() {
            return {
                users:    [],
                loading:  'Chargement...',
                headers:  true,
                invite:   true,
                roles:    true,
                emails:   true,
                filtered: true,
                status:   false
            };
        },

        getInitialState: function() {
            return {
                users:  [],
                loaded: false
            };
        },

        componentWillMount: function() {
            if(!TeamStore) {
                TeamStore = MiitApp.get('miit-team-store');
            }
            if(!TeamActions) {
                TeamActions = MiitApp.get('miit-team-actions');
            }
            if(!UserStatusStore) {
                UserStatusStore = MiitApp.get('miit-user-status-store');
            }
            if(!UserStatusActions) {
                UserStatusActions = MiitApp.get('miit-user-status-actions');
            }
            this.setState({
                users: TeamStore.getUsers(this.props.filtered)
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
        },

        _refresh: function() {
            if(this.isMounted()) {
                this.setState({
                    users:  TeamStore.getUsers(this.props.filtered).sortBy('name'),
                    loaded: true
                });
            }
        },

        render: function() {
            return (
                React.createElement("div", {className: "miit-component user-list"}, 
                    React.createElement(If, {test: this.props.headers}, 
                        React.createElement(MiitComponents.UserListHeader, {email: this.props.emails, roles: this.props.roles})
                    ), 
                    this.state.users.map(function(user) {
                        return React.createElement(MiitComponents.UserListItem, {key: user.id, user: user, email: this.props.emails, roles: this.props.roles, status: this.props.status});
                    }.bind(this)), 
                    React.createElement(If, {test: !this.state.loaded}, 
                        React.createElement(MiitComponents.Loading, null)
                    ), 
                    React.createElement(If, {test: this.props.invite}, 
                        React.createElement(MiitComponents.UserListInvite, {onInvite: this.allowRefresh})
                    )
                )
            );
        }
    });
})();
//# sourceMappingURL=../../../team/component/user/user-list.js.map