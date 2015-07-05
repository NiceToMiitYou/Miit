(function(){
    var TeamStore, TeamActions, UserStatusStore, UserStatusActions;

    MiitComponents.UserList = React.createClass({
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
                users: UserStatusStore.getUsers(this.props.filtered).sortBy('name')
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
            // Status Changed
            UserStatusStore.removeStatusChangedListener(this._refresh);
        },

        _refresh: function() {
            if(this.isMounted()) {
                this.setState({
                    users:  UserStatusStore.getUsers(this.props.filtered).sortBy('name'),
                    loaded: true
                });
            }
        },

        render: function() {
            return (
                <div className="miit-component user-list">
                    <If test={this.props.headers}>
                        <MiitComponents.UserListHeader email={this.props.emails} roles={this.props.roles} />
                    </If>
                    {this.state.users.map(function(user) {
                        return <MiitComponents.UserListItem key={user.id} user={user} email={this.props.emails} roles={this.props.roles} status={this.props.status} />;
                    }.bind(this))}
                    <If test={!this.state.loaded}>
                        <MiitComponents.Loading />
                    </If>
                    <If test={this.props.invite}>
                        <MiitComponents.UserListInvite onInvite={this.allowRefresh} />
                    </If>
                </div>
            );
        }
    });
})();