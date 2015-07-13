
// Include requirements
var UserStore   = require('../../../../application/stores/user-store'),
    TeamStore   = require('../../../../application/stores/team-store');

// Include common
var If   = require('../../../common/if.jsx'),
    Link = require('../../../common/link.jsx');

var MenuHeader = React.createClass({
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

module.exports = MenuHeader;
