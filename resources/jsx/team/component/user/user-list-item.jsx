(function(){
    var UserStore, UserStatusStore;

    MiitComponents.UserListItem = React.createClass({
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

        componentWillMount: function() {
            if(!UserStore) {
                UserStore = MiitApp.get('miit-user-store');
            }
            if(!UserStatusStore) {
                UserStatusStore = MiitApp.get('miit-user-status-store');
            }
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
                    <MiitComponents.UserAvatar user={this.props.user} />
                    <span className="pl10">{name}</span>

                    <If test={this.props.status}>
                        <span className={classes}><i className="icon-logo-miit"></i></span>
                    </If>
                    
                    <If test={this.props.email && UserStore.isUser()}>
                        <span className="pl10">{this.props.user.email}</span>
                    </If>
                    
                    <If test={this.props.roles && UserStore.isAdmin()}>
                        <MiitComponents.UserListItemRoles user={this.props.user}/>
                    </If>
                </div>
            );
        }
    });
})();