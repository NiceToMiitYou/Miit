'use strict';

// Include requirements
var TeamStore          = require('core/stores/team-store'),
    SubscriptionsStore = require('core/stores/subscriptions-store');

// Include common
var If   = require('templates/if.jsx'),
    Link = require('core/templates/components/link.jsx');

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
            label:       '',
            activeGroup: 'menu-team',
            activeName:  '',
            link:        ''
        };
    },

    render: function() {
        var application = this.props.application;

        if(false === TeamStore.hasApplication(application)) {
            return null;
        }

        var unread = SubscriptionsStore.getUnreadByApplication(application);

        return (
            <li>
                <Link href={this.props.link} activeGroup={this.props.activeGroup} activeName={this.props.activeName}>
                    <i className="fa fa-weixin pull-left"></i> {this.props.label}
                    <If test={unread > 0}>
                        <span className="notification">{unread}</span>
                    </If>
                </Link>
            </li>
        );
    }
});

module.exports = MenuTeamItem;