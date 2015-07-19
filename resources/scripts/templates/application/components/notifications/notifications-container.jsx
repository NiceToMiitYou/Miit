'use strict';

// Include requirements
var NotificationsStore = require('application/stores/notifications-store');

var NotificationsContainer = React.createClass({
    componentDidMount: function() {
        NotificationsStore.addNotificationAddedListener(this._onChanged);
        NotificationsStore.addNotificationRemovedListener(this._onChanged);
    },

    componentWillUnmount: function() {
        NotificationsStore.addNotificationRemovedListener(this._onChanged);
    },

    _onChanged: function() {
        this.forceUpdate();
    },
    
    render: function() {
        var notifications = NotificationsStore.getNotifications() || [];

        return (
            <div className="miit-component notifications-container dialog-container">
                {notifications.map(function(notification){
                    return (<Notification key={notification.id} type={notification.type} text={notification.text} />);
                })}
            </div>
        );
    }
});

module.exports = NotificationsContainer;
