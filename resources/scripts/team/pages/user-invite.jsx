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

var UserInvite = React.createClass({
    getDefaultProps: function () {
        return {
            placeholder: {
                password: 'Votre mot de passe',
                confirm:  'Confirmez votre mot de passe'
            },
            text: {
                title:                  'Répondre à une invitation',
                create_account:         'Créer un compte',
                login_account:          'Connexion à votre compte',
                password_requierements: 'Votre mot de passe doit comporté un minimum de 8 caractères et comprendre des minuscules, majuscules et au moins un chiffre.',
                wrong_login:            'Votre mot de passe est incorrect.'
            },
            submit: 'Me joindre au Miit!'
        };
    },

    getInitialState: function() {
        var initial = this.getDefaultErrors();

        initial.token          = PageStore.getArgument();
        initial.user           = null;
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
            result = UserActions.getInvitation(token);

        if(false === result) {
            Router.setRoute('/');
            return;
        }
    },

    componentDidMount: function () {
        UserStore.addRetrieveInvitationListener(this._onRefresh);
        UserStore.addAchievedInvitationListener(this._onRegister);
    },

    componentWillUnmount: function () {
        UserStore.removeRetrieveInvitationListener(this._onRefresh);
        UserStore.removeAchievedInvitationListener(this._onRegister);
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

    _onRefresh: function(invitation, user) {
        // If no invitation go to home
        if(!invitation) {
            Router.setRoute('/');
            return;
        }

        this.setState({
            value_email: invitation.email,
            user:        user
        });
    },

    _onRegister: function(user) {
        if(!user) {
            this.setState({
                value_password: '',
                invalid_format: true
            });

            NotificationsActions.notify('danger', this.props.text.wrong_login);

            return;
        }

        Router.setRoute('/');
    },

    handleSubmit: function(e) {
        e.preventDefault();

        var token    = this.state.token,
            email    = this.state.value_email,
            password = this.state.value_password,
            confirm  = this.state.value_confirm,
            user     = this.state.user;
        
        this.setState(this.getDefaultErrors());

        // Check if there is data
        if (!password || !user && !confirm) {
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

        if(!user && password !== confirm) {
            this.setState({
                invalid_repeated: true
            });
            return;
        }

        UserActions.register(token, email, password);

        return;
    },

    render: function() {
        var token       = this.state.token,
            value_email = this.state.value_email,
            user        = this.state.user;

        if(!token || !value_email) {
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

        var login = false,
            title = this.props.text.create_account;

        if(user) {
            login = true;
            title = this.props.text.login_account;
        }

        return (
            <div className="miit-component user-invite container-fluid">
                <div className="page-title">
                    <h2>
                        <i className="fa fa-envelope-o pull-left mr15"></i> {this.props.text.title} 
                    </h2>
                </div>

                <div className="panel mb30 mt30">
                    <h2 className="panel-title"><i className="fa fa-lock pull-left"></i> {title}</h2>
                    <div className="panel-content">
                        <form onSubmit={this.handleSubmit}>
                            <div className="input-field left-icon mb20">
                                <i className="fa fa-envelope-o"></i>
                                <input type="text" value={value_email} name="email" disabled={true}/>
                            </div>

                            <div className="input-field left-icon mb25">
                                <i className="fa fa-lock"></i>
                                <input type="password" className={classes_password} value={value_password} placeholder={this.props.placeholder.password} onChange={this.handleChange} name="password" />
                            </div>

                            <If test={false === login}>
                                <div className="input-field left-icon mb25">
                                    <i className="fa fa-lock"></i>
                                    <input type="password" className={classes_confirm}  value={value_confirm}  placeholder={this.props.placeholder.confirm}  onChange={this.handleChange} name="confirm" />
                                </div>
                            </If>

                            <button className="btn btn-info" type="submit">{this.props.submit}</button>     
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

PageStore.registerApplicationPage('user', 'i', UserInvite);

module.exports = UserInvite;