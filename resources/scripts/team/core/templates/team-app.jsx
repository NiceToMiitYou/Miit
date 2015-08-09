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

var TeamApp = React.createClass({
    getInitialState: function() {
        return {
            page:        PageStore.getCurrentMainPage(),
            menu_opened: PageStore.getMenuState()
        };
    },

    componentDidMount: function() {
        UserStore.addLoggedInListener(this._onLoggedIn);
        TeamStore.addTeamUpdatedListener(this._onChange);
        PageStore.addPageChangedListener(this._onChange);
        PageStore.addMenuToggledListener(this._onToggle);
    },

    componentWillUnmount: function() {
        UserStore.removeLoggedInListener(this._onLoggedIn);
        TeamStore.removeTeamUpdatedListener(this._onChange);
        PageStore.removePageChangedListener(this._onChange);
        PageStore.removeMenuToggledListener(this._onToggle);
    },

    _onLoggedIn: function() {
        // Refresh the list of subscriptions
        SubscriptionsActions.refresh();

        // Finally call onChange to refresh the page
        this._onChange();
    },

    _onChange: function() {
        if(this.isMounted()) {
            var page = PageStore.getCurrentMainPage();

            this.setState({
                page: page || PageStore.getNotFoundPage() || null
            });
        }
    },

    _onToggle: function(open) {
        if(this.isMounted()) {
            this.setState({
                menu_opened: open
            });
        }
    },

    render: function() {
        var Page       = this.state.page;
        var MenuOpened = this.state.menu_opened;

        var classes = classNames('team-app page bg-grey lighten-5', (true === MenuOpened) ? 'menu-open': 'menu-close');

        return (
            <div className={classes}>
                <MenuTeam />

                <div className="main container-fluid">
                    <Page />
                </div>
            
                <ModalContainer />
                <NotificationContainer />
            </div>
        );
    }
});

module.exports = TeamApp;
