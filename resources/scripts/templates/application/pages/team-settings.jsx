'use strict';

// Include requirements
var PageStore = require('application/stores/page-store'),
    UserStore = require('application/stores/user-store'),
    TeamStore = require('application/stores/team-store');

// Include Layout
var Layout = require('./layouts/default.jsx');

// Include components
var NotFound   = require('./not-found.jsx'),
    UserList   = require('templates/application/components/user/user-list.jsx'),
    TeamUpdate = require('templates/application/components/team/team-update.jsx');

var TeamSettings = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                applications: 'Applications',
                informations: 'Informations'
            }
        };
    },

    componentDidMount: function() {
        TeamStore.addTeamUpdatedListener(this._onChange);
    },

    componentWillUnmount: function() {
        TeamStore.removeTeamUpdatedListener(this._onChange);
    },

    _onChange: function() {
        this.forceUpdate();
    },

    render: function() {
        if(!UserStore.isAdmin()) {
            return <NotFound />;
        }

        var team = TeamStore.getTeam();

        return (
            <Layout title={team.name}>
                <div className="panel mb30 mt30">
                    <h2 className="panel-title"><i className="fa fa-th pull-left "></i> {this.props.text.applications}</h2>
                    <div className="panel-content">
                        <div className="row">
                            <ul className="app-list col-md-12">

                                <li>
                                    <a>
                                        <i className="fa fa-weixin bg-blue"></i>
                                        <span>Chat</span>
                                    </a>
                                </li>

                                <li>
                                    <a>
                                        <i className="fa fa-question bg-green"></i>
                                        <span>Quizz</span>
                                    </a>
                                </li>

                                <li>
                                    <a className="add-app">
                                        <i className="fa fa-plus bg-blue-grey"></i>
                                        <span>Ajouter une App</span>
                                    </a>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>

                <div className="panel mt30" >
                    <h2 className="panel-title"><i className="fa fa-info pull-left "></i>{this.props.text.informations}</h2>
                    <div className="panel-content">
                        <h3 className="mb20"><i className="fa fa-key pull-left"></i> Modifier les informations</h3>
                        <TeamUpdate />

                        <h3 className="mt40 mb10"><i className="fa fa-users pull-left"></i> Liste des utilisateurs</h3>
                        <UserList autoload={true} />
                    </div>
                </div>
            </Layout>
        );
    }
});

PageStore.registerMainPage('settings', (<TeamSettings />));
