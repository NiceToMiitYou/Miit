(function(){
    var UserStore;

    MiitComponents.MenuUserProfile = React.createClass({
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
                <span className="miit-component user-profile">
                    <div className="avatar">
                        <MiitComponents.UserAvatar user={user} />
                    </div>
                    <span className="username">{ name }</span>
                    <span><i className="fa fa-circle-thin stat-open mr5"></i> Connecté</span>
                </span>
            );
        }
    });
})();