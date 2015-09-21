'use strict';

// Include requirements
var PageStore = require('core/stores/page-store'),
    UserStore = require('core/stores/user-store');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

// Include components
var Default            = require('./default.jsx'),
    NotFound           = require('./not-found.jsx'),
    UserUpdate         = require('core/templates/user/user-update.jsx'),
    UserChangePassword = require('core/templates/user/user-change-password.jsx');

var UserSettings = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                informations:        'Informations',
                change_informations: 'Modifier vos informations',
                change_password:     'Changer de mot de passe'
            }
        };
    },

    componentDidMount: function() {
        UserStore.addUserUpdatedListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeUserUpdatedListener(this._onChange);
    },

    _onChange: function() {
        this.forceUpdate();
    },

    render: function() {
        if(UserStore.isAnonym()) {
            return <NotFound />;
        }

        return (
            <Layout>
                <div className="container-fluid">
                    <div className="panel mt30" >
                        <h2 className="panel-title"><i className="fa fa-th pull-left "></i>{this.props.text.informations}</h2>
                        <div className="panel-content">
                            <div className="row">
                                <div className="col-md-7 mb20">
                                    <h3 className="mb20"><i className="fa fa-key pull-left"></i> {this.props.text.change_informations}</h3>
                                    <UserUpdate />
                                </div>

                                <div className="col-md-5">
                                    <h3 className="mb20"><i className="fa fa-key pull-left"></i> {this.props.text.change_password}</h3>
                                    <UserChangePassword />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
});

// Load default pages
PageStore.registerMainPage('user', Default('user'), true);

PageStore.registerMainPage('me', UserSettings);

module.exports = UserSettings;
