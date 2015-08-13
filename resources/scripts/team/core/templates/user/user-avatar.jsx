'use strict';

// Include requirements
var UserStore = require('core/stores/user-store');

var UserAvatar = React.createClass({
    render: function() {
        var user   = this.props.user || UserStore.getUser();
        var avatar;

        if(user.avatar) {
            avatar = 'http://img.miit.fr/avatar/' + user.avatar;
        }

        avatar = avatar || '/img/logo-miit-light.png';

        return (
            <span className="miit-component user-avatar">
                <img src={avatar} {...this.props} />
            </span>
        );
    }
});

module.exports = UserAvatar;
