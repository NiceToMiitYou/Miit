'use strict';

// Include requirements
var TeamStore          = require('core/stores/team-store'),
    SubscriptionsStore = require('core/stores/subscriptions-store');

// Include translation
var Translations = require('core/translation');

// Include common
var If   = require('templates/if.jsx');

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
            application: '',
            activeGroup: 'menu-team'
        };
    },

    render: function() {
        var application = this.props.application;

        if(false === TeamStore.hasApplication(application)) {
            return null;
        }

        // Link information
        var activeName = application.replace('APP_', '').toLowerCase();
        var link       = '#/' + activeName + '/';

        // Informations
        var label  = Translations[application];
        var unread = SubscriptionsStore.getUnreadByApplication(application);

        return (
            <li>
                <Link href={link} activeGroup={this.props.activeGroup} activeName={activeName}>
                    <i className="fa fa-weixin pull-left"></i> {label}
                    <If test={unread > 0}>
                        <span className="notification">{unread}</span>
                    </If>
                </Link>
            </li>
        );
    }
});

module.exports = MenuTeamItem;