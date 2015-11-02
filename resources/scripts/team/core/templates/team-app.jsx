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
    resizeListenerDebounce: null,

    getInitialState: function() {
        return {
            page:              PageStore.getCurrentMainPage(),
            left_menu_opened:  PageStore.getLeftMenuState(),
            right_menu_opened: PageStore.getRightMenuState(),
            right_menu_locked: PageStore.getRightMenuLockState()
        };
    },

    componentDidMount: function() {
        this.resizeListenerDebounce = Debounce(this.resizeListener, 75);

        UserStore.addLoggedInListener(this._onLoggedIn);
        TeamStore.addTeamUpdatedListener(this._onChange);
        PageStore.addPageChangedListener(this._onChange);
        PageStore.addLeftMenuToggledListener(this._onToggleLeft);
        PageStore.addRightMenuToggledListener(this._onToggleRight);
        PageStore.addRightMenuLockToggledListener(this._onToggleRightLock);

        if(window.addEventListener)
        {
            window.addEventListener('resize', this.resizeListenerDebounce, false); 
        }
        else if(window.attachEvent)
        {
            window.attachEvent('onresize', this.resizeListenerDebounce);
        }

        this._onLoggedIn();
    },

    componentWillUnmount: function() {
        UserStore.removeLoggedInListener(this._onLoggedIn);
        TeamStore.removeTeamUpdatedListener(this._onChange);
        PageStore.removePageChangedListener(this._onChange);
        PageStore.removeLeftMenuToggledListener(this._onToggleLeft);
        PageStore.removeRightMenuToggledListener(this._onToggleRight);
        PageStore.removeRightMenuLockToggledListener(this._onToggleRightLock);

        if(window.removeEventListener)
        {
            window.removeEventListener('resize', this.resizeListenerDebounce, false); 
        }
        else if(window.detachEvent)
        {
            window.detachEvent('onresize', this.resizeListenerDebounce);
        }
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

    resizeListener: function() {
        this.forceUpdate();
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
        var Page = this.state.page;

        // Menu informations
        var LeftMenuOpened  = this.state.left_menu_opened,
            RightMenuOpened = this.state.right_menu_opened,
            RightMenuLocked = this.state.right_menu_locked;

        // Window information
        var height = window.innerHeight,
            width  = window.innerWidth;

        var classes = classNames('team-app page', 
            (true === LeftMenuOpened)  ? 'left-menu-open'  : 'menu-close',
            (true === RightMenuOpened) ? 'right-menu-open' : '',
            (true === RightMenuLocked) ? 'right-menu-lock' : '',
            (height >= width) ? 'window-portrait' : 'window-landscape'
        );

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
