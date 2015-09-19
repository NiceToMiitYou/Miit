'use strict';

// Include requirements
var UserStore  = MiitApp.require('core/stores/user-store'),
    TeamStore  = MiitApp.require('core/stores/team-store');

// Include common components
var DateFormat = MiitApp.require('templates/date-format.jsx');

// Include components
var TextParser = MiitApp.require('core/templates/components/text-parser.jsx'),
    UserAvatar = MiitApp.require('core/templates/user/user-avatar.jsx');

var ChatMessageListItem = React.createClass({
    getDefaultProps: function () {
        return {
            message: {}
        };
    },

    render: function() {
        // User informations
        var user = TeamStore.getUser(this.props.message.user),
            name = UserStore.getName(user);

        // Message informations
        var id        = this.props.message.id,
            text      = this.props.message.text,
            createdAt = this.props.message.createdAt;

        if(false === Array.isArray(text)) {
            text = [text];
        }

        var count = 0;

        return (
            <div className="miit-component chat-message-list-item">
                <UserAvatar user={user} height="42"/>
                <div className="user-info">
                    <span className="username">{name}</span>
                    <DateFormat date={createdAt} from={true} />
                </div>
                <div className="message-content">
                    {text.map(function(str) {
                        count++;

                        return (
                            <p key={'message-text-' + id + '-' + count}>
                                <TextParser text={str} />
                            </p>
                        );
                    })}
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
});

module.exports = ChatMessageListItem;
