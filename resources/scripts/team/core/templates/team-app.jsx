'use strict';

// Include requirements
var UserStore            = require('core/stores/user-store'),
    TeamStore            = require('core/stores/team-store'),
    PageStore            = require('core/stores/page-store'),
    UserActions          = require('core/actions/user-actions'),
    PageActions          = require('core/actions/page-actions'),
    SubscriptionsActions = require('core/actions/subscriptions-actions');

// Include components
var MenuTeam              = require('core/templates/menu/menu-team.jsx'),
    ModalContainer        = require('core/templates/modal/modal-container.jsx'),
    NotificationContainer = require('core/templates/notifications/notification-container.jsx');


// Load all pages
var pages = require('pages/_load');

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
            <div className="bg-grey lighten-5">
                <div className="page bg-grey lighten-5">
                    <MenuTeam />

                    <div className="main">
                        {this.state.page}
                    </div>
                </div>
            
                <ModalContainer />
                <NotificationContainer />
            </div>
        );
    }
});

module.exports = TeamApp;
