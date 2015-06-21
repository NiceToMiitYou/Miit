(function(){
    var UserStore;

    MiitComponents.UserListHeader = React.createClass({displayName: "UserListHeader",
        getDefaultProps: function() {
            return {
                text: {
                    avatar: 'Avatar',
                    name:   'Name',
                    email:  'Email',
                    action: 'Action'
                },
                email: true,
                roles: true
            };
        },
        
        componentWillMount: function() {
            if(!UserStore) {
                UserStore = MiitApp.get('miit-user-store');
            }
        },

        render: function() {
            return (
                React.createElement("div", {className: "miit-component user-list-header"}, 
                    React.createElement("span", null, this.props.text.avatar), 
                    React.createElement("span", null, this.props.text.name), 
                    React.createElement(If, {test: this.props.email && UserStore.isUser()}, 
                        React.createElement("span", null, this.props.text.email)
                    ), 
                    React.createElement(If, {test: this.props.roles && UserStore.isAdmin()}, 
                        React.createElement("span", null, this.props.text.action)
                    )
                )
            );
        }
    });
})();
//# sourceMappingURL=../../../team/component/user/user-list-header.js.map