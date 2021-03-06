'use strict';

// Include requirements
var UserStore            = require('core/stores/user-store'),
    UserActions          = require('core/actions/user-actions'),
    NotificationsActions = require('core/actions/notifications-actions'),
    TeamStore            = require('core/stores/team-store'),
    PageStore            = require('core/stores/page-store');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

// Include components
var Link = require('core/templates/components/link.jsx');

var Login = React.createClass({
    getDefaultProps: function() {
        return {
            text: {
                title:        'Connexion au Miit',
                remember_me:  'Mot de passe oublié?',
                loginSuccess: 'Bienvenue',
                loginError:   'Votre adresse mail ou votre mot de passe est incorrect(e).'
            },
            placeholder: {
                email:    'Adresse email',
                password: 'Mot de passe'
            },
            submit: 'Se connecter'
        };
    },

    getInitialState: function() {
        var initial = this.getDefaultErrors();

        initial.value_email    = '';
        initial.value_password = '';

        return initial;
    },

    getDefaultErrors: function() {
        return {
            login_error:      false,
            missing_email:    false,
            missing_password: false,
            invalid_format:   false
        };
    },

    componentDidMount: function() {
        UserStore.addLoggedInListener(this._onLoggedIn);
        UserStore.addLoginErrorListener(this._onError);
    },

    componentWillUnmount: function() {
        UserStore.removeLoggedInListener(this._onLoggedIn);
        UserStore.removeLoginErrorListener(this._onError);
    },

    _onLoggedIn: function() {
        if(this.isMounted()) { 
            var notifLogin = this.props.text.loginSuccess + ' ' + UserStore.getName();
            NotificationsActions.notify('success', notifLogin);
            this.forceUpdate();
        }
    },

    _onError: function() {
        if(this.isMounted()) {
            NotificationsActions.notify('danger', this.props.text.loginError);
            this.setState({
                login_error:    true,
                value_password: ''
            });
        }
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

        var email    = this.state.value_email;
        var password = this.state.value_password;
        
        this.setState(this.getDefaultErrors());

        // Check if there is data
        if (!email || !password) {
            this.setState({
                missing_email:    !email,
                missing_password: !password,
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

        UserActions.login(email, password);

        return;
    },

    render: function() {
        // Don't display if Logged In
        if(UserStore.isLoggedIn()) {
            return null;
        }

        var value_email    = this.state.value_email;
        var classes_email  = classNames({
            'invalid': this.state.missing_email  ||
                       this.state.invalid_format ||
                       this.state.login_error
        });

        var value_password   = this.state.value_password;
        var classes_password = classNames({
            'invalid': this.state.missing_password ||
                       this.state.login_error
        });

        return (
            <Layout>
                <span className="miit-component user-login">
                    <div className="panel mb30 mt30">
                        <h2 className="panel-title"><i className="fa fa-lock pull-left "></i> {this.props.text.title}</h2>
                        <div className="panel-content">
                            <form onSubmit={this.handleSubmit}>
                                <div className="input-field left-icon mb20">
                                    <i className="fa fa-envelope-o"></i>
                                    <input type="text"     className={classes_email}    value={value_email}    placeholder={this.props.placeholder.email}    onChange={this.handleChange} name="email" />
                                </div>
                                <div className="input-field left-icon mb25">
                                    <i className="fa fa-lock"></i>
                                    <input type="password" className={classes_password} value={value_password} placeholder={this.props.placeholder.password} onChange={this.handleChange} name="password" />
                                </div>

                                <button className="btn btn-info" type="submit">{this.props.submit}</button>
                                <Link href="#/user/request" className="remember-me pull-right">
                                    {this.props.text.remember_me}
                                </Link>
                            </form>
                        </div>
                    </div>
                </span>
            </Layout>
        );
    }
});

PageStore.registerMainPage('login', Login);

module.exports = Login;