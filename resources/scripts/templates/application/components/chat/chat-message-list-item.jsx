
// Include requirements
var TeamStore  = require('application/stores/team-store');

// Include common components
var DateFormat = require('templates/common/date-format.jsx');

// Include components
var UserAvatar = require('../user/user-avatar.jsx');

var ChatMessageListItem = React.createClass({
    getDefaultProps: function () {
        return {
            text:      '',
            user:      '',
            createdAt: new Date()  
        };
    },

    render: function() {
        var user      = TeamStore.getUser(this.props.user);
        var text      = this.props.text;
        var createdAt = this.props.createdAt;

        return (
            <div className="miit-component chat-message-list-item">
                <UserAvatar user={user} height="42"/>
                <DateFormat date={createdAt} from={true} />
                {text}
            </div>
        );
    }
});

module.exports = ChatMessageListItem;
