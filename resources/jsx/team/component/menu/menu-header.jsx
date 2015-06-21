(function(){
    var TeamStore, UserStore;

    MiitComponents.MenuHeader = React.createClass({
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
                <div className="miit-component menu-header sl-header">
                    <If test={UserStore.isAdmin()}>
                        <Link href="#/settings">
                            {team.name} <i className="fa fa-cogs pull-right"></i>
                        </Link>
                    </If>
                    <If test={!UserStore.isAdmin()}>
                        <div>
                            {team.name}
                        </div>
                    </If>
                </div>
            );
        }
    });
})();