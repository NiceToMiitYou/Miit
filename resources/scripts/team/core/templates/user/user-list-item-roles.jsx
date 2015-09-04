'use strict';

// Include requirements
var UserStore            = require('core/stores/user-store'),
    TeamStore            = require('core/stores/team-store'),
    NotificationsActions = require('core/actions/notifications-actions'),
    TeamActions          = require('core/actions/team-actions');

var UserListItemRoles = React.createClass({
    getDefaultProps: function() {
        return {
            text: {
                admin:  'Administrateur',
                chnageUser:  'La modification a bien été prise en compte pour l\'utilisateur ',
                remove: 'Supprimer'
            },
            user: {
                id:    '',
                roles: []
            }
        };
    },

    getInitialState: function() {
        return {
            loading: false
        };
    },

    componentDidMount: function() {
        // Promote
        TeamStore.addPromotedListener(this._onChanged);
        // Demote
        TeamStore.addDemotedListener(this._onChanged);
    },

    componentWillUnmount: function() {
        // Promote
        TeamStore.removePromotedListener(this._onChanged);
        // Demote
        TeamStore.removeDemotedListener(this._onChanged);
    },

    _onChanged: function(id) {
        if (this.props.user.id === id) {
            var user = this.props.user;

            NotificationsActions.notify('success', this.props.text.chnageUser + user.name);
            this.forceUpdate();
        }
    },

    toggleRole: function(role, cb) {
        var action = 'promote';

        if(this.props.user.roles.indexOf(role) >= 0) {
            action = 'demote';
        }

        TeamActions[action](this.props.user.id, [role]);
    },

    handleClick: function(action, e) {
        e.preventDefault();

        var IAmAdmin    = UserStore.isAdmin();
        var userIsOwner = UserStore.isOwner(this.props.user);
        var userIsAdmin = UserStore.isAdmin(this.props.user);
        var userIsMe    = UserStore.isItMe(this.props.user);

        // Check if I am an admin and not myself or an owner
        if(!IAmAdmin || userIsMe || userIsOwner)
            return;

        // Check if I want to remove an admin
        if(action === 'REMOVE' && userIsAdmin)
            return;

        this.setState({
            loading: true
        });

        switch(action) {
            case 'ADMIN':
                this.toggleRole(action);
                break;

            case 'REMOVE':
                TeamActions.remove(this.props.user.id);
                break;
        }
    },

    render: function() {
        var IAmAdmin = UserStore.isAdmin();

        if(false === IAmAdmin) {
            return null;
        }

        var userIsAdmin = UserStore.isAdmin(this.props.user);
        var userIsMe    = UserStore.isItMe(this.props.user);

        var admin_active = classNames({
            disable: !IAmAdmin || userIsMe,
            active:  userIsAdmin
        });

        var remove_active = classNames({
            disable: !IAmAdmin || userIsMe || userIsAdmin
        });

        return (
            <span className="miit-component user-list-item-roles mt5">

                <button onClick={this.handleClick.bind(this, 'REMOVE')} className='btn pull-left btn-danger btn-sm mr10 pl15 pr15' disabled={remove_active}>
                    <i className="fa fa-trash-o"></i>
                </button>

                <div className="checkbox-field pull-left" onClick={this.handleClick.bind(this, 'ADMIN')} >
                    <label>
                        <input type="checkbox" className="option-input checkbox" checked={userIsAdmin} readOnly />
                        {this.props.text.admin}
                    </label>
                </div>
            </span>
        );
    }
});

module.exports = UserListItemRoles;