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

var UserPasswordReset = React.createClass({
    getDefaultProps: function () {
        return {
            placeholder: {
                password: 'Votre mot de passe',
                confirm:  'Confirmez votre mot de passe'
            },
            text: {
                title:                  'Réinitialisation de votre mot de passe',
                already_connected:      'Vous ne pouvez pas vous réinitialisez votre mot de passe en étant connecté.',
                password_requierements: 'Votre mot de passe doit comporter un minimum de 8 caractères et comprendre des minuscules, majuscules et au moins un chiffre.'
            },
            submit: 'Changer le mot de passe'
        };
    },

    getInitialState: function() {
        var initial = this.getDefaultErrors();

        initial.token          = PageStore.getArgument();
        initial.value_email    = '';
        initial.value_password = '';
        initial.value_confirm  = '';

        return initial;
    },

    getDefaultErrors: function() {
        return {
            missing_password: false,
            missing_confirm:  false,
            invalid_repeated: false,
            invalid_format:   false
        };
    },

    componentWillMount: function () {
        var token  = this.state.token,
            result = UserActions.password.get(token);

        if(false === UserStore.isAnonym()) {
            NotificationsActions.notify('danger', this.props.text.already_connected);
        }

        if(
            false === result ||
            false === UserStore.isAnonym()
        ) {
            Router.setRoute('/');
            return;
        }
    },

    componentDidMount: function () {
        UserStore.addRetrievePasswordResetListener(this._onRefresh);
        UserStore.addAchievedPasswordResetListener(this._onChanged);
    },

    componentWillUnmount: function () {
        UserStore.removeRetrievePasswordResetListener(this._onRefresh);
        UserStore.removeAchievedPasswordResetListener(this._onChanged);
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

    _onRefresh: function(user) {
        // If no request go to home
        if(!user) {
            Router.setRoute('/');
            return;
        }

        this.setState({
            value_email: user.email
        });
    },

    _onChanged: function() {
        Router.setRoute('/login');
    },

    handleSubmit: function(e) {
        e.preventDefault();

        var token    = this.state.token,
            password = this.state.value_password,
            confirm  = this.state.value_confirm;
        
        this.setState(this.getDefaultErrors());

        // Check if there is data
        if (!password || !confirm) {
            this.setState({
                missing_password: !password,
                missing_confirm:  !confirm
            });
            return;
        }

        // Check if this is a correct format
        if(!MiitUtils.validator.password(password)) {
            this.setState({
                invalid_format: true
            });
            return;
        }

        if(password !== confirm) {
            this.setState({
                invalid_repeated: true
            });
            return;
        }

        UserActions.password.reset(token, password);

        return;
    },

    render: function() {
        var token       = this.state.token,
            value_email = this.state.value_email;

        if(false === UserStore.isAnonym() || !token || !value_email) {
            return null;
        }

        var value_password   = this.state.value_password;
        var classes_password = classNames({
            'invalid': this.state.missing_password ||
                       this.state.invalid_format
        });

        var value_confirm   = this.state.value_confirm;
        var classes_confirm = classNames({
            'invalid': this.state.missing_confirm ||
                       this.state.invalid_repeated
        });

        return (
            <div className="miit-component user-password-reset">
                <div className="panel mb30 mt30">
                    <h2 className="panel-title"><i className="fa fa-lock pull-left"></i> {this.props.text.title}</h2>
                    <div className="panel-content">
                        <form onSubmit={this.handleSubmit}>
                            <p className="text-100 mb15">{this.props.text.password_requierements}</p>
 
                            <div className="input-field left-icon mb20">
                                <i className="fa fa-envelope-o"></i>
                                <input type="text" value={value_email} name="email" disabled={true}/>
                            </div>

                            <div className="input-field left-icon mb25">
                                <i className="fa fa-lock"></i>
                                <input type="password" className={classes_password} value={value_password} placeholder={this.props.placeholder.password} onChange={this.handleChange} name="password" />
                            </div>

                            <div className="input-field left-icon mb25">
                                <i className="fa fa-lock"></i>
                                <input type="password" className={classes_confirm}  value={value_confirm}  placeholder={this.props.placeholder.confirm}  onChange={this.handleChange} name="confirm" />
                            </div>

                            <button className="btn btn-info" type="submit">{this.props.submit}</button>     
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

PageStore.registerApplicationPage('user', 'reset', UserPasswordReset);

module.exports = UserPasswordReset;