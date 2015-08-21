'use strict';

// Include requirements
var TeamStore          = require('core/stores/team-store'),
    SubscriptionsStore = require('core/stores/subscriptions-store');

// Include translation
var Translations = require('core/translation');

// Include common
var If = require('templates/if.jsx');

// Include components
var Link = require('core/templates/components/link.jsx')

var MenuTeamItem = React.createClass({
    componentDidMount: function () {
        SubscriptionsStore.addSubscriptionsUpdatedListener(this._onChange);
    },

    componentWillUnmount: function () {
        SubscriptionsStore.removeSubscriptionsUpdatedListener(this._onChange);
    },

    _onChange: function() {
        this.forceUpdate();
    },

    getDefaultProps: function () {
        return {
            application: {},
            activeGroup: 'menu-team'
        };
    },

    render: function() {
        var application = this.props.application;
        var apps = MiitApp.shared.get('applications');

        if(false === TeamStore.hasApplication(application.identifier)) {
            return null;
        }
        // Link information
        var activeName = application.identifier.replace('APP_', '').toLowerCase();
        var link       = '#/' + activeName + '/';

        application.color = apps[application.identifier].color;
        application.icon  = apps[application.identifier].icon;
        
        var appClasses = classNames('fa', 'fa-' + application.icon, 'bg-' + application.color, 'pull-left');

        // Informations
        var label  = Translations[application.identifier];
        var unread = SubscriptionsStore.getUnreadByApplication(application.identifier);

        return (
            <li>
                <Link href={link} activeGroup={this.props.activeGroup} activeName={activeName}>
                    <i className={appClasses}></i> {label}
                    <If test={unread > 0}>
                        <span className="notification">{unread}</span>
                    </If>
                </Link>
            </li>
        );
    }
});

module.exports = MenuTeamItem;