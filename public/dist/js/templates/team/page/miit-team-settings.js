(function(){
    var UserStore, TeamStore;

    MiitComponents.MiitTeamSettings = React.createClass({displayName: "MiitTeamSettings",
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
                return React.createElement(MiitComponents.MiitNotFound, null);
            }

            var team = TeamStore.getTeam();

            return (
                React.createElement("div", {className: "container-fluid"}, 
                    React.createElement("div", {className: "page-header"}, 
                        React.createElement("a", {href: "#", className: "minimize-menu"}, 
                            React.createElement("i", {className: "fa fa-bars"})
                        ), 
                        React.createElement("h1", null, team.name), 
                        React.createElement(MiitComponents.Clock, null)
                    ), 
                    
                    React.createElement("div", {className: "panel mb30 mt30"}, 
                        React.createElement("h2", {className: "panel-title"}, React.createElement("i", {className: "fa fa-th pull-left "}), " ", this.props.text.applications), 
                        React.createElement("div", {className: "panel-content"}, 
                            React.createElement("div", {className: "row"}, 
                                React.createElement("ul", {className: "app-list col-md-12"}, 

                                    React.createElement("li", null, 
                                        React.createElement("a", null, 
                                            React.createElement("i", {className: "fa fa-weixin bg-blue"}), 
                                            React.createElement("span", null, "Chat")
                                        )
                                    ), 

                                    React.createElement("li", null, 
                                        React.createElement("a", null, 
                                            React.createElement("i", {className: "fa fa-question bg-green"}), 
                                            React.createElement("span", null, "Quizz")
                                        )
                                    ), 

                                    React.createElement("li", null, 
                                        React.createElement("a", {className: "add-app"}, 
                                            React.createElement("i", {className: "fa fa-plus bg-blue-grey"}), 
                                            React.createElement("span", null, "Ajouter une App")
                                        )
                                    )

                                )
                            )
                        )
                    ), 

                    React.createElement("div", {className: "panel mt30"}, 
                        React.createElement("h2", {className: "panel-title"}, React.createElement("i", {className: "fa fa-info pull-left "}), this.props.text.informations), 
                        React.createElement("div", {className: "panel-content"}, 
                            React.createElement("h3", {className: "mb20"}, React.createElement("i", {className: "fa fa-key pull-left"}), " Modifier les informations"), 
                            React.createElement(MiitComponents.TeamUpdate, null), 

                            React.createElement("h3", {className: "mt40 mb10"}, React.createElement("i", {className: "fa fa-users pull-left"}), " Liste des utilisateurs"), 
                            React.createElement(MiitComponents.UserList, {autoload: true})
                        )
                    )
                )
            );
        }
    });

    MiitApp
        .get('miit-page-store')
        .registerMainPage('settings', (React.createElement(MiitComponents.MiitTeamSettings, null)));
})();
//# sourceMappingURL=../../team/page/miit-team-settings.js.map