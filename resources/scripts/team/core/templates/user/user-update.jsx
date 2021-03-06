'use strict';

// Include requirements
var UserStore            = require('core/stores/user-store'),
    NotificationsActions = require('core/actions/notifications-actions'),
    UserActions          = require('core/actions/user-actions');

var UserUpdate = React.createClass({
    getDefaultProps: function() {
        return {
            placeholder: {
                name: 'Votre nom'
            },
            submit:            'Modifier',
            changeNameSuccess: 'Votre nom a été changé avec succès',
            changeNameError:   'Une erreur s\'est produite lors du changement de votre nom'
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
        var user = UserStore.getUser();

        // Reset value
        this.setState({
            value_name: user.name
        });
    },

    componentDidMount: function() {
        UserStore.addUserUpdatedListener(this._onChanged);
    },

    componentWillUnmount: function() {
        UserStore.removeUserUpdatedListener(this._onChanged);
    },

    _onChangedDebounce: null,

    _onChanged: function() {
        if(!this._onChangedDebounce) {
            this._onChangedDebounce = Debounce(function() {
                if(this.isMounted()) {
                    var user = UserStore.getUser();

                    NotificationsActions.notify('success', this.props.changeNameSuccess);

                    // Reset value
                    this.setState({
                        value_name: user.name
                    });
                }
            }.bind(this), 250);
        }

        this._onChangedDebounce();
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
        if(!MiitUtils.validator.user(name)) {
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
            <form className="miit-component user-update" onSubmit={this.handleSubmit}>
                <input type="text" className={classes_name} value={value_name} placeholder={this.props.placeholder.name} onChange={this.handleChange} name="name" />
                <button type="submit" className="btn btn-info mt20">{this.props.submit}</button> 
            </form>
        );
    }
});

module.exports = UserUpdate;