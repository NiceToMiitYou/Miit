(function(){
    var Utils, UserStore, TeamStore, TeamActions;

    MiitComponents.UserListInvite = React.createClass({displayName: "UserListInvite",
        getDefaultProps: function() {
            return {
                placeholder: {
                    email: 'Addresse mail'
                },
                submit: 'Inviter l\'utilisateur'
            };
        },

        getInitialState: function() {
            var initial = this.getDefaultErrors();

            initial.email = '';

            return initial;
        },

        getDefaultErrors: function() {
            return {
                missing_email: false,
                invalid_email: false
            };
        },

        componentWillMount: function() {
            if(!Utils) {
                Utils = MiitApp.get('miit-utils');
            }
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
            TeamStore.addInvitedListener(this._onInvited);
            TeamStore.addNotInvitedListener(this._onError);
        },

        componentWillUnmount: function() {
            TeamStore.removeInvitedListener(this._onInvited);
            TeamStore.removeNotInvitedListener(this._onError);
        },

        handleChange: function(newValue) {
            this.setState({
                email: newValue.trim()
            });
        },

        handleSubmit: function(e) {
            e.preventDefault();

            var email = this.state.email;
            
            this.setState(this.getDefaultErrors());

            // Check if this is an admin
            if(!UserStore.isAdmin()){
                return;
            }

            // Check if there is data
            if (!email) {
                this.setState({
                    missing_email: true
                });
                return;
            }

            // Check if this is a correct format
            if(!Utils.validator.email(email)) {
                this.setState({
                    invalid_email: true
                });
                return;
            }

            TeamActions.invite(email);

            return;
        },

        _onInvited: function() {
            this.setState({
                email: ''
            });

            if(typeof this.props.onInvite === 'function') {
                this.props.onInvite(email);
            }
        },

        _onError: function() {
            console.log('Can not invite the user.');
        },

        render: function() {
            // Check if this is an admin
            if(!UserStore.isAdmin()){
                return null;
            }

            var classes_invalid = classNames({
                'invalid': this.state.missing_email ||
                           this.state.invalid_email
            });

            var valueLinkEmail  = {
                value:         this.state.email,
                requestChange: this.handleChange
            };

            return (
                React.createElement("div", {className: "miit-component user-list-invite mt20"}, 
                    React.createElement("form", {onSubmit: this.handleSubmit}, 

                        React.createElement("div", {className: "input-field left-icon col-md-7 mb10"}, 
                            React.createElement("i", {className: "fa fa-user-plus"}), 
                            React.createElement("input", {type: "text", className: classes_invalid, placeholder: this.props.placeholder.email, valueLink: valueLinkEmail})
                        ), 

                        React.createElement("button", {type: "submit", className: "btn btn-info btn-large ml15"}, this.props.submit)
                    )
                )
            );
        }
    });
})();
//# sourceMappingURL=../../../team/component/user/user-list-invite.js.map