(function(){
    MiitComponents.Notification = React.createClass({displayName: "Notification",
        getDefaultProps: function () {
            return {
                notification: {
                    type: 'info',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing.'
                }
            };
        },

        render: function() {
            var classes = classNames('miit-component', 'notifications-container', 'notification-dialog', 'nd-' + this.props.notification.type);

            return (
                React.createElement("div", {className: classes}, 
                    React.createElement("span", null, this.props.notification.text)
                )
            );
        }
    });
})();

//# sourceMappingURL=../../../team/component/notifications/miit-notification.js.map