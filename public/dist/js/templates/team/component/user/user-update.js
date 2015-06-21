(function(){
    var Utils, UserActions, UserStore;

    MiitComponents.UserUpdate = React.createClass({displayName: "UserUpdate",
        getDefaultProps: function() {
            return {
                placeholder: {
                    name: 'Votre nom'
                },
                submit: 'Modifier'
            };
        },

        getInitialState: function() {
            var initial = this.getDefaultErrors();

            initial.value_name = '';

            return initial;
        },

        getDefaultErrors: function() {
            return {
                missing_name:   false,
                invalid_same:   false,
                invalid_format: false
            };
        },
        
        componentWillMount: function() {
            if(!Utils) {
                Utils = MiitApp.get('miit-utils');
            }
            if(!UserStore) {
                UserStore = MiitApp.get('miit-user-store');
            }
            if(!UserActions) {
                UserActions = MiitApp.get('miit-user-actions');
            }
            
            var user = UserStore.getUser();

            // Reset value
            this.setState({
                value_name: user.name
            });
        },

        componentDidMount: function() {
            UserStore.addUserUpdatedListener(this._onChanged);
            UserStore.addUserNotUpdatedListener(this._onError);
        },

        componentWillUnmount: function() {
            UserStore.removeUserUpdatedListener(this._onChanged);
            UserStore.removeUserNotUpdatedListener(this._onError);
        },

        _onChanged: function() {
            if(this.isMounted()) {
                var user = UserStore.getUser();

                // Reset value
                this.setState({
                    value_name: user.name
                });
            }
        },

        _onError: function() {
            console.log('user not updated.');
        },
        
        handleChange: function(e) {
            if(e.target && e.target.name) {
                var update = {};
                var name   = 'value_' + e.target.name;
                var value  = e.target.value || '';

                update[name] = value;

                this.setState(update);
            }
        },

        handleSubmit: function(e) {
            e.preventDefault();

            var name = this.state.value_name;
            var user = UserStore.getUser();
            
            this.setState(this.getDefaultErrors());

            // Check if there is data
            if (!name) {
                this.setState({
                    missing_name: !name
                });
                return;
            }

            // Check if the old is the same as the old
            if(name === user.name) {
                this.setState({
                    invalid_same: true
                });
                return;
            }

            // Check if this is a correct format
            if(!Utils.validator.user(name)) {
                this.setState({
                    invalid_format: true
                });
                return;
            }

            UserActions.update(name);

            return;
        },

        render: function() {
            var value_name   = this.state.value_name;
            var classes_name = classNames({
                'invalid': this.state.missing_name ||
                           this.state.invalid_same ||
                           this.state.invalid_format
            });

            return (
                React.createElement("form", {className: "miit-component user-update", onSubmit: this.handleSubmit}, 
                    React.createElement("input", {type: "text", className: classes_name, value: value_name, placeholder: this.props.placeholder.name, onChange: this.handleChange, name: "name"}), 
                    React.createElement("button", {type: "submit", className: "btn btn-info mt20"}, this.props.submit)
                )
            );
        }
    });
})();
//# sourceMappingURL=../../../team/component/user/user-update.js.map