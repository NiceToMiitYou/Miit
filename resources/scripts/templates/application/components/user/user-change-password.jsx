
// Include requirements
var UserStore   = require('../../../../application/stores/user-store'),
    UserActions = require('../../../../application/actions/user-actions');

var UserChangePassword = React.createClass({
    getDefaultProps: function() {
        return {
            placeholder: {
                old:    'Votre mot de passe',
                first:  'Le nouveau mot de passe',
                second: 'Entrez le mot de passe à nouveau'
            },
            submit: 'Changer le mot de passe'
        };
    },

    getInitialState: function() {
        var initial = this.getDefaultErrors();

        initial.value_old    = '';
        initial.value_first  = '';
        initial.value_second = '';

        return initial;
    },

    getDefaultErrors: function() {
        return {
            missing_old:      false,
            missing_first:    false,
            missing_second:   false,
            invalid_old:      false,
            invalid_same:     false,
            invalid_repeated: false,
            invalid_format:   false
        };
    },
    
    componentDidMount: function() {
        UserStore.addPasswordChangedListener(this._onChanged);
        UserStore.addPasswordNotChangedListener(this._onError);
    },

    componentWillUnmount: function() {
        UserStore.removePasswordChangedListener(this._onChanged);
        UserStore.removePasswordNotChangedListener(this._onError);
    },

    _onChanged: function() {
        if(this.isMounted()) {
            // Reset value
            this.setState({
                value_old:    '',
                value_first:  '',
                value_second: ''
            });
        }
    },

    _onError: function() {
        console.log('password not changed.');
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

        var old    = this.state.value_old;
        var first  = this.state.value_first;
        var second = this.state.value_second;
        
        this.setState(this.getDefaultErrors());

        // Check if there is data
        if (!old || !first || !second) {
            this.setState({
                missing_old:    !old,
                missing_first:  !first,
                missing_second: !second
            });
            return;
        }

        // Check if this is a correct repeated
        if(first !== second) {
            this.setState({
                invalid_repeated: true
            });
            return;
        }

        // Check if the old is the same as the old
        if(first === old) {
            this.setState({
                invalid_same: true
            });
            return;
        }

        // Check if this is a correct format
        if(!MiitUtils.validator.password(first)) {
            this.setState({
                invalid_format: true
            });
            return;
        }

        UserActions.changePassword(old, first);

        return;
    },

    render: function() {
        var value_old      = this.state.value_old;
        var classes_old    = classNames({
            'invalid': this.state.missing_old ||
                       this.state.invalid_old
        });

        var value_first    = this.state.value_first;
        var classes_first  = classNames({
            'invalid': this.state.missing_first ||
                       this.state.invalid_same  ||
                       this.state.invalid_format
        });

        var value_second   = this.state.value_second;
        var classes_second = classNames({
            'invalid': this.state.missing_second ||
                       this.state.invalid_repeated
        });

        return (
            <form className="miit-component change-password" onSubmit={this.handleSubmit}>
                <input type="password" className={classes_old + " mb15"}    value={value_old}    placeholder={this.props.placeholder.old}    onChange={this.handleChange} name="old" />
                <input type="password" className={classes_first + " mb15"}  value={value_first}  placeholder={this.props.placeholder.first}  onChange={this.handleChange} name="first" />
                <input type="password" className={classes_second + " mb20"} value={value_second} placeholder={this.props.placeholder.second} onChange={this.handleChange} name="second" />
                <button className="btn btn-warning" type="submit">{this.props.submit}</button>     
            </form>
        );
    }
});

module.exports = UserChangePassword;