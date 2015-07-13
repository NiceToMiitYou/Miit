
var Notification = React.createClass({
    getDefaultProps: function () {
        return {
            type: 'info',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing.'
        };
    },

    render: function() {
        var classes = classNames('miit-component', 'notifications-container', 'notification-dialog', 'nd-' + this.props.type);

        return (
            <div className={classes}>
                <span>{this.props.text}</span>
            </div>
        );
    }
});

module.exports = Notification;
