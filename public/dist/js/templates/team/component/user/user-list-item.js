(function(){
    var UserStore, UserStatusStore;

    MiitComponents.UserListItem = React.createClass({displayName: "UserListItem",
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
                React.createElement("div", {className: "miit-component user-list-item"}, 
                    React.createElement(MiitComponents.UserAvatar, {user: this.props.user}), 
                    React.createElement("span", {className: "pl10"}, name), 

                    React.createElement(If, {test: this.props.status}, 
                        React.createElement("span", {className: classes}, React.createElement("i", {className: "icon-logo-miit"}))
                    ), 
                    
                    React.createElement(If, {test: this.props.email && UserStore.isUser()}, 
                        React.createElement("span", {className: "pl10"}, this.props.user.email)
                    ), 
                    
                    React.createElement(If, {test: this.props.roles && UserStore.isAdmin()}, 
                        React.createElement(MiitComponents.UserListItemRoles, {user: this.props.user})
                    )
                )
            );
        }
    });
})();
//# sourceMappingURL=../../../team/component/user/user-list-item.js.map