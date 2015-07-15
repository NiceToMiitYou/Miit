
// Include requirements
var UserStore   = require('application/stores/user-store');

var ChatMessageListItem = React.createClass({
    getDefaultProps: function () {
        return {
            text:      '',
            user:      '',
            createdAt: new Date()  
        };
    },

    render: function() {
        var user      = this.props.user;
        var text      = this.props.text;
        var createdAt = this.props.createdAt;

        return (
            <div className="miit-component chat-message-list-item">
                {createdAt} - {text}
            </div>
        );
    }
});

module.exports = ChatMessageListItem;
