'use strict';

var Notification = React.createClass({
    getDefaultProps: function () {
        return {
            type: 'info',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing.'
        };
    },

    getInitialState: function () {
        return {
            hide: false  
        };
    },

    onClickHide: function() {
        this.setState({
            hide: true
        });
    },

    render: function() {
        if(this.state.hide) {
            return null;
        }

        var classes = classNames('miit-component', 'notifications-container', 'notification-dialog', 'nd-' + this.props.type);

        return (
            <div className={classes} onClick={this.onClickHide}>
                <span>{this.props.text}</span>
            </div>
        );
    }
});

module.exports = Notification;
