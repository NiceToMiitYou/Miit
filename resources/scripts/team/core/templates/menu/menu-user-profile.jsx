'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store');

// Include components
var UserAvatar = require('core/templates/user/user-avatar.jsx');

var MenuUserProfile = React.createClass({
   getDefaultProps: function() {
        return {
            text: {
                logout:    'Déconnexion',
                login:     'Connexion',
                connected: 'Connecté',
                profile:   'Modifier mon profile',
                team:      'Modifier l\'équipe'
            }
        };
    },

    componentDidMount: function() {
        UserStore.addLoggedInListener(this._onChanged);
        UserStore.addUserUpdatedListener(this._onChanged);
    },

    componentWillUnmount: function() {
        UserStore.removeLoggedInListener(this._onChanged);
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
                    <UserAvatar user={user} />
                </div>
                <span className="username">{name}</span>
                <span><i className="fa fa-circle-thin stat-open mr5"></i> {this.props.text.connected}</span>
            </span>
        );
    }
});

module.exports = MenuUserProfile;