(function(){
    var UserStore;

    MiitComponents.UserAvatar = React.createClass({displayName: "UserAvatar",
        componentWillMount: function() {
            if(!UserStore) {
                UserStore = MiitApp.get('miit-user-store');
            }
        },

        render: function() {
            var user   = this.props.user || UserStore.getUser();
            var avatar;

            if(user.avatar) {
                avatar = 'http://www.gravatar.com/avatar/' + user.avatar + '?s=128&d=identicon';
            }

            avatar = avatar || '/img/logo-miit-light.png';

            return (
                React.createElement("span", {className: "miit-component user-avatar"}, 
                    React.createElement("img", React.__spread({src: avatar},  this.props))
                )
            );
        }
    });
})();

//# sourceMappingURL=../../../team/component/user/user-avatar.js.map