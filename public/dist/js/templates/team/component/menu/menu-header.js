(function(){
    var TeamStore, UserStore;

    MiitComponents.MenuHeader = React.createClass({displayName: "MenuHeader",
        componentWillMount: function() {
            if(!TeamStore) {
                TeamStore = MiitApp.get('miit-team-store');
            }
            if(!UserStore) {
                UserStore = MiitApp.get('miit-user-store');
            }
        },

        componentDidMount: function() {
            TeamStore.addTeamUpdatedListener(this._onChanged);
        },

        componentWillUnmount: function() {
            TeamStore.removeTeamUpdatedListener(this._onChanged);
        },

        _onChanged: function() {
            this.forceUpdate();
        },

        render: function() {
            var team = TeamStore.getTeam();

            return (
                React.createElement("div", {className: "miit-component menu-header sl-header"}, 
                    React.createElement(If, {test: UserStore.isAdmin()}, 
                        React.createElement(Link, {href: "#/settings"}, 
                            team.name, " ", React.createElement("i", {className: "fa fa-cogs pull-right"})
                        )
                    ), 
                    React.createElement(If, {test: !UserStore.isAdmin()}, 
                        React.createElement("div", null, 
                            team.name
                        )
                    )
                )
            );
        }
    });
})();
//# sourceMappingURL=../../../team/component/menu/menu-header.js.map