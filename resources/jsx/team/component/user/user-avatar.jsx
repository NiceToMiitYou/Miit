(function(){
    var UserStore;

    MiitComponents.UserAvatar = React.createClass({
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
                <span className="miit-component user-avatar">
                    <img src={avatar} {...this.props} />
                </span>
            );
        }
    });
})();
