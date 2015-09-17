'use strict';

// Include requirements
var Router               = require('core/lib/router'),
    PageStore            = require('core/stores/page-store'),
    UserStore            = require('core/stores/user-store'),
    UserActions          = require('core/actions/user-actions'),
    NotificationsActions = require('core/actions/notifications-actions');

// Include common
var If = require('templates/if.jsx');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

var UserPasswordRequest = React.createClass({
    getDefaultProps: function () {
        return {
            placeholder: {
                email: 'Votre email'
            },
            text: {
                title:              'Récupération de mot de passe',
                password_requested: 'Votre demande de récupération de mot de passe a bien été prise en compte.'
            },
            submit: 'Récupérer votre mot de passe'
        };
    },

    getInitialState: function() {
        var initial = this.getDefaultErrors();

        initial.value_email = '';

        return initial;
    },

    getDefaultErrors: function() {
        return {
            missing_email:  false,
            invalid_format: false
        };
    },

    componentWillMount: function () {
        if(false === UserStore.isAnonym()) {
            Router.setRoute('/');
            return;
        }  
    },

    componentDidMount: function () {
        UserStore.addPasswordRequestedListener(this._onRequested);
    },

    componentWillUnmount: function () {
        UserStore.removePasswordRequestedListener(this._onRequested);
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

    _onRequested: function() {
        NotificationsActions.notify('success', this.props.text.password_requested);

        this.setState({
            value_email: ''
        });
    },

    handleSubmit: function(e) {
        e.preventDefault();

        var email = this.state.value_email;

        this.setState(this.getDefaultErrors());

        // Check if there is data
        if (!email) {
            this.setState({
                missing_email: !email
            });
            return;
        }

        // Check if this is a correct format
        if(!MiitUtils.validator.email(email)) {
            this.setState({
                invalid_format: true
            });
            return;
        }

        UserActions.password.request(email);

        return;
    },

    render: function() {
        var value_email   = this.state.value_email;
        var classes_email = classNames({
            'invalid': this.state.missing_email ||
                       this.state.invalid_format
        });
        
        if(false === UserStore.isAnonym()) {
            return null;
        }

        return (
            <div className="miit-component user-password-request">
                <div className="panel mb30 mt30">
                    <h2 className="panel-title"><i className="fa fa-lock pull-left"></i> {this.props.text.title}</h2>
                    <div className="panel-content">
                        <form onSubmit={this.handleSubmit}>
                            
                            <div className="input-field left-icon mb20">
                                <i className="fa fa-envelope-o"></i>
                                <input type="text" className={classes_email} value={value_email} placeholder={this.props.placeholder.email} onChange={this.handleChange} name="email" />
                            </div>

                            <button className="btn btn-info" type="submit">{this.props.submit}</button>     
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

PageStore.registerApplicationPage('user', 'request', UserPasswordRequest);

module.exports = UserPasswordRequest;