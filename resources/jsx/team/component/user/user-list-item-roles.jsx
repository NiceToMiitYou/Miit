(function() {
    var UserStore, TeamStore, TeamActions;

    MiitComponents.UserListItemRoles = React.createClass({
        getDefaultProps: function() {
            return {
                text: {
                    admin:  'Administrateur',
                    user:   'Utilisateur',
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

        componentWillMount: function() {
            if(!UserStore) {
                UserStore = MiitApp.get('miit-user-store');
            }
            if(!TeamStore) {
                TeamStore = MiitApp.get('miit-team-store');
            }
            if(!TeamActions) {
                TeamActions = MiitApp.get('miit-team-actions');
            }
        },

        componentDidMount: function() {
            // Promote
            TeamStore.addPromotedListener(this._onPromoted);
            TeamStore.addNotPromotedListener(this._onError);
            // Demote
            TeamStore.addDemotedListener(this._onDemoted);
            TeamStore.addNotDemotedListener(this._onError);
        },

        componentWillUnmount: function() {
            // Promote
            TeamStore.removePromotedListener(this._onPromoted);
            TeamStore.removeNotPromotedListener(this._onError);
            // Demote
            TeamStore.removeDemotedListener(this._onDemoted);
            TeamStore.removeNotDemotedListener(this._onError);
        },

        _stopLoading: function() {
            if(this.isMounted()) {
                this.setState({
                    loading: false
                });
            }
        },

        _onPromoted: function() {
            this._stopLoading();
        },

        _onDemoted: function() {
            this._stopLoading();
        },

        _onError: function() {
            this._stopLoading();
            console.log('Can not promote or demote the user.');
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

            // Don't load twice
            if(this.state.loading)
                return;

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
                case 'USER':
                    this.toggleRole(action);
                    break;

                case 'REMOVE':
                    TeamActions.remove(this.props.user.id);
                    break;
            }
        },

        render: function() {
            var IAmAdmin    = UserStore.isAdmin();

            if(false === IAmAdmin) {
                return null;
            }

            var userIsAdmin = UserStore.isAdmin(this.props.user);
            var userIsUser  = UserStore.isUser(this.props.user);
            var userIsMe    = UserStore.isItMe(this.props.user);

            var user_active = classNames({
                disable: !IAmAdmin || userIsMe || userIsAdmin,
                active:  userIsUser
            });

            var admin_active = classNames({
                disable: !IAmAdmin || userIsMe,
                active:  userIsAdmin
            });

            var remove_active = classNames({
                disable: !IAmAdmin || userIsMe || userIsAdmin
            });

            return (
                <span className="miit-component user-list-item-roles">
                    <div className="checkbox-field pull-left" onClick={this.handleClick.bind(this, 'USER')} >
                        <label>
                            <input type="checkbox" className="option-input checkbox" checked={userIsUser} readOnly/>
                            {this.props.text.user}
                        </label>
                    </div>

                    <div className="checkbox-field pull-left ml20" onClick={this.handleClick.bind(this, 'ADMIN')} >
                        <label>
                            <input type="checkbox" className="option-input checkbox" checked={userIsAdmin} readOnly/>
                            {this.props.text.admin}
                        </label>
                    </div>

                    <button onClick={this.handleClick.bind(this, 'REMOVE')} className='btn btn-danger ml20' disabled={remove_active}>
                        <i className="fa fa-trash-o"></i>
                    </button>
                </span>
            );
        }
    });
})();