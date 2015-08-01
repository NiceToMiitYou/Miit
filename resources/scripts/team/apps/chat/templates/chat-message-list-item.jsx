'use strict';

// Include requirements
var UserStore  = MiitApp.require('core/stores/user-store'),
    TeamStore  = MiitApp.require('core/stores/team-store');

// Include common components
var DateFormat = MiitApp.require('templates/date-format.jsx');

// Include components
var UserAvatar = MiitApp.require('core/templates/user/user-avatar.jsx');

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
        var name      = UserStore.getName(user);
        var text      = this.props.text;
        var createdAt = this.props.createdAt;

        return (
            <div className="miit-component chat-message-list-item">
                <UserAvatar user={user} height="42"/>
                <div className="user-info">
                    <span className="username">{name}</span>
                    <DateFormat date={createdAt} from={true} />
                </div>
                <div className="message-content">{text}</div>
                <div className="clearfix"></div>
            </div>
        );
    }
});

module.exports = ChatMessageListItem;
