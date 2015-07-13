
// Include requirements
var UserStore   = require('../../application/stores/user-store'),
    PageStore   = require('../../application/stores/page-store'),
    UserActions = require('../../application/actions/user-actions'),
    PageActions = require('../../application/actions/page-actions');

// Include components
var MenuTeam               = require('./components/menu/menu-team.jsx'),
    NotificationsContainer = require('./components/notifications/notifications-container.jsx');

// Load pages
var pages = require('./pages/_load');

// The default page
var defaultPage = pages.default;

var TeamApp = React.createClass({
    getInitialState: function() {
        return {
            page: null
        };
    },

    componentDidMount: function() {
        UserStore.addLoggedInListener(this._onChange);
        PageStore.addMainPageChangedListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeLoggedInListener(this._onChange);
        PageStore.removeMainPageChangedListener(this._onChange);
    },

    _onChange: function() {
        var page = PageStore.getCurrentMainPage();

        if(!page)
        {
            setTimeout(function(){
                PageActions.changeMainPage('not-found');
            });
        }
        else if(this.isMounted())
        {
            this.setState({
                page: page
            });
        }
    },

    render: function() {
        return (
            <div className="page bg-grey lighten-5">
                <MenuTeam />

                <div className="main">
                    {this.state.page}
                </div>

                <NotificationsContainer />
            </div>
        );
    }
});

module.exports = TeamApp;
