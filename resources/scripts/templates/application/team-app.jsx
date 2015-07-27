'use strict';

// Include requirements
var UserStore            = require('application/stores/user-store'),
    TeamStore            = require('application/stores/team-store'),
    PageStore            = require('application/stores/page-store'),
    UserActions          = require('application/actions/user-actions'),
    PageActions          = require('application/actions/page-actions'),
    SubscriptionsActions = require('application/actions/subscriptions-actions');

// Include components
var MenuTeam               = require('templates/application/components/menu/menu-team.jsx'),
    NotificationsContainer = require('templates/application/components/notifications/notifications-container.jsx');


// Load all pages
var pages = require('templates/application/pages/_load');

var TeamApp = React.createClass({
    getInitialState: function() {
        return {
            page: null
        };
    },

    componentDidMount: function() {
        UserStore.addLoggedInListener(this._onLoggedIn);
        TeamStore.addTeamUpdatedListener(this._onChange);
        PageStore.addMainPageChangedListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeLoggedInListener(this._onLoggedIn);
        TeamStore.removeTeamUpdatedListener(this._onChange);
        PageStore.removeMainPageChangedListener(this._onChange);
    },

    _onLoggedIn: function() {
        // Refresh the list of subscriptions
        SubscriptionsActions.refresh();

        // Finally call onChange to refresh the page
        this._onChange();
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
