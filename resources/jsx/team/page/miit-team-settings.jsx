(function(){
    var UserStore, TeamStore;

    MiitComponents.MiitTeamSettings = React.createClass({
        getDefaultProps: function () {
            return {
                text: {
                    applications:  'Applications',
                    informations: 'Informations'
                }
            };
        },

        componentWillMount: function() {
            if(!UserStore) {
                UserStore = MiitApp.get('miit-user-store');
            }
            if(!TeamStore) {
                TeamStore = MiitApp.get('miit-team-store');
            }
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
                return <MiitComponents.MiitNotFound />;
            }

            var team = TeamStore.getTeam();

            return (
                <div className="container-fluid">
                    <div className="page-header">
                        <a href="#" className="minimize-menu">
                            <i className="fa fa-bars"></i>
                        </a>
                        <h1>{team.name}</h1>
                        <MiitComponents.Clock />
                    </div>
                    
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
                            <MiitComponents.TeamUpdate />

                            <h3 className="mt40 mb10"><i className="fa fa-users pull-left"></i> Liste des utilisateurs</h3>
                            <MiitComponents.UserList autoload={true} />
                        </div>
                    </div>
                </div>
            );
        }
    });

    MiitApp.onInit(function() {
        MiitApp
            .get('miit-page-store')
            .registerMainPage('settings', (<MiitComponents.MiitTeamSettings />));
    });
})();