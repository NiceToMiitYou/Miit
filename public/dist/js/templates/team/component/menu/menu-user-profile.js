(function(){
    var UserStore;

    MiitComponents.MenuUserProfile = React.createClass({displayName: "MenuUserProfile",
       getDefaultProps: function() {
            return {
                text: {
                    logout:  'Déconnexion',
                    login:   'Connexion',
                    profile: 'Modifier mon profile',
                    team:    'Modifier l\'équipe'
                }
            };
        },

        componentWillMount: function() {
            if(!UserStore) {
                UserStore = MiitApp.get('miit-user-store');
            }
        },

        componentDidMount: function() {
            UserStore.addUserUpdatedListener(this._onChanged);
        },

        componentWillUnmount: function() {
            UserStore.removeUserUpdatedListener(this._onChanged);
        },

        _onChanged: function() {
            this.forceUpdate();
        },

        render: function() {
            var user = UserStore.getUser();
            var name = UserStore.getName(user);

            return (
                React.createElement("span", {className: "miit-component user-profile"}, 
                    React.createElement("div", {className: "avatar"}, 
                        React.createElement(MiitComponents.UserAvatar, {user: user})
                    ), 
                    React.createElement("span", {className: "username"},  name ), 
                    React.createElement("span", null, React.createElement("i", {className: "fa fa-circle-thin stat-open mr5"}), " Connecté")
                )
            );
        }
    });
})();
//# sourceMappingURL=../../../team/component/menu/menu-user-profile.js.map