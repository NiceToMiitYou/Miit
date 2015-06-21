(function(){
    MiitComponents.Notification = React.createClass({
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
                <div className={classes}>
                    <span>{this.props.notification.text}</span>
                </div>
            );
        }
    });
})();
