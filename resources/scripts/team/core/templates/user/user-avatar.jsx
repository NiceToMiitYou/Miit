'use strict';

// Include requirements
var UserStore = require('core/stores/user-store');

var UserAvatar = React.createClass({
    render: function() {
        var user   = this.props.user || UserStore.getUser();
        var avatar;

        if(user.avatar) {
            avatar = window.MiitAvatarUrl + user.avatar;
        }

        avatar = avatar || '/img/logo-miit-white.png';

        return (
            <span className="miit-component user-avatar">
                <img src={avatar} {...this.props} />
            </span>
        );
    }
});

module.exports = UserAvatar;
