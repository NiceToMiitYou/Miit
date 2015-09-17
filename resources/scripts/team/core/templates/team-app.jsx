'use strict';

// Include requirements
var UserStore            = require('core/stores/user-store'),
    TeamStore            = require('core/stores/team-store'),
    PageStore            = require('core/stores/page-store'),
    UserActions          = require('core/actions/user-actions'),
    PageActions          = require('core/actions/page-actions'),
    SubscriptionsActions = require('core/actions/subscriptions-actions');

// Include common
var If = require('templates/if.jsx');

// Include components
var MenuTeam              = require('core/templates/menu/menu-team.jsx'),
    RightMenu             = require('core/templates/right-menu/right-menu.jsx'),
    ModalContainer        = require('core/templates/modal/modal-container.jsx'),
    NotificationContainer = require('core/templates/notifications/notification-container.jsx');

var TeamApp = React.createClass({
    getInitialState: function() {
        return {
            page:              PageStore.getCurrentMainPage(),
            left_menu_opened:  PageStore.getLeftMenuState(),
            right_menu_opened: PageStore.getRightMenuState(),
            right_menu_locked: PageStore.getRightMenuLockState()
        };
    },

    componentDidMount: function() {
        UserStore.addLoggedInListener(this._onLoggedIn);
        TeamStore.addTeamUpdatedListener(this._onChange);
        PageStore.addPageChangedListener(this._onChange);
        PageStore.addLeftMenuToggledListener(this._onToggleLeft);
        PageStore.addRightMenuToggledListener(this._onToggleRight);
        PageStore.addRightMenuLockToggledListener(this._onToggleRightLock);
        this._onLoggedIn();
    },

    componentWillUnmount: function() {
        UserStore.removeLoggedInListener(this._onLoggedIn);
        TeamStore.removeTeamUpdatedListener(this._onChange);
        PageStore.removePageChangedListener(this._onChange);
        PageStore.removeLeftMenuToggledListener(this._onToggleLeft);
        PageStore.removeRightMenuToggledListener(this._onToggleRight);
        PageStore.removeRightMenuLockToggledListener(this._onToggleRightLock);
    },

    _onLoggedIn: function() {
        // Refresh the list of subscriptions
        if(
            false === UserStore.isAnonym() ||
            true  === TeamStore.isPublic()
        ) {
            SubscriptionsActions.refresh();
        }

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

    _onToggleLeft: function(open) {
        if(this.isMounted()) {
            this.setState({
                left_menu_opened: open
            });
        }
    },

    _onToggleRight: function(open) {
        if(this.isMounted()) {
            this.setState({
                right_menu_opened: open
            });
        }
    },

    _onToggleRightLock: function(open) {
        if(this.isMounted()) {
            this.setState({
                right_menu_locked: open
            });
        }
    },

    render: function() {
        var Page       = this.state.page;
        var LeftMenuOpened  = this.state.left_menu_opened;
        var RightMenuOpened = this.state.right_menu_opened;
        var RightMenuLocked = this.state.right_menu_locked;

        var classes = classNames('team-app page', 
            (true === LeftMenuOpened) ? 'left-menu-open': 'menu-close',
            (true === RightMenuOpened) ? 'right-menu-open': '',
            (true === RightMenuLocked) ? 'right-menu-lock': '');

        return (
            <div className={classes}>
                <MenuTeam />

                <div className="main">
                    <If test={!!Page}>
                        <Page />
                    </If>
                </div>

                <RightMenu />
            
                <ModalContainer />
                <NotificationContainer />
            </div>
        );
    }
});

module.exports = TeamApp;
