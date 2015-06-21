(function(){
    var NotificationsStore;

    MiitComponents.NotificationsContainer = React.createClass({displayName: "NotificationsContainer",
        componentWillMount: function() {
            if(!NotificationsStore) {
                NotificationsStore = MiitApp.get('miit-notifications-store');
            }
        },

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
                React.createElement("div", {className: "miit-component notifications-container dialog-container"}, 
                    notifications.map(function(notification){
                        return (React.createElement(MiitComponents.Notification, {key: notification.id, notification: notification}));
                    })
                )
            );
        }
    });
})();

//# sourceMappingURL=../../../team/component/notifications/miit-notifications-container.js.map