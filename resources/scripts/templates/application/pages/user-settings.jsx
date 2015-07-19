'use strict';

// Include requirements
var PageStore = require('application/stores/page-store'),
    UserStore = require('application/stores/user-store');

// Include Layout
var Layout = require('./layouts/default.jsx');

// Include components
var NotFound           = require('./not-found.jsx'),
    UserUpdate         = require('templates/application/components/user/user-update.jsx'),
    UserChangePassword = require('templates/application/components/user/user-change-password.jsx');

var UserSettings = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                informations: 'Informations'
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

        var name = UserStore.getName();

        return (
            <Layout title={name}>
                <div className="panel mt30" >
                    <h2 className="panel-title"><i className="fa fa-th pull-left "></i>{this.props.text.informations}</h2>
                    <div className="panel-content">
                        <div className="row">
                            <div className="col-md-7 mb20">
                                <h3 className="mb20"><i className="fa fa-key pull-left"></i> Modifier vos informations</h3>
                                <UserUpdate />
                            </div>

                            <div className="col-md-5">
                                <h3 className="mb20"><i className="fa fa-key pull-left"></i> Changer de mot de passe</h3>
                                <UserChangePassword />
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
});

PageStore.registerMainPage('me', (<UserSettings />));
