'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    TeamStore   = require('core/stores/team-store'),
    TeamActions = require('core/actions/team-actions');

var UserListInvite = React.createClass({
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

    componentDidMount: function() {
        TeamStore.addInvitedListener(this._onInvited);
    },

    componentWillUnmount: function() {
        TeamStore.removeInvitedListener(this._onInvited);
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
        if(!UserStore.isAdmin()) {
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
        if(!MiitUtils.validator.email(email)) {
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
            <div className="miit-component user-list-invite mt20">
                <form onSubmit={this.handleSubmit}>

                    <div className="input-field left-icon col-md-7 mb10">
                        <i className="fa fa-user-plus"></i>
                        <input type="text" className={classes_invalid} placeholder={this.props.placeholder.email} valueLink={valueLinkEmail} />
                    </div>

                    <button type="submit" className="btn btn-info btn-large ml15">{this.props.submit}</button>
                </form>
            </div>
        );
    }
});

module.exports = UserListInvite;