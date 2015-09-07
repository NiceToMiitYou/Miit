'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store'),
    TeamStore  = MiitApp.require('core/stores/team-store');

// Include common templates
var If         = MiitApp.require('templates/if.jsx'),
    Tooltip    = MiitApp.require('templates/tooltip.jsx'),
    DateFormat = MiitApp.require('templates/date-format.jsx');

// Include core templates
var UserAvatar = MiitApp.require('core/templates/user/user-avatar.jsx');

// Include requirements
var WallActions = require('wall-actions');

var WallListItemCommentListItem = React.createClass({
    getDefaultProps: function () {
        return {
            question: '',
            comment:  {},
            text: {
                remove: 'Supprimer'
            }
        };
    },

    _onRemoveComment: function() {
        var question = this.props.question,
            comment  = this.props.comment.id;
    
        WallActions.uncomment(question, comment);
    },

    render: function() {
        var comment   = this.props.comment,
            createdAt = comment.createdAt;

        var user = TeamStore.getUser(this.props.comment.user);
        var name = UserStore.getName(user);

        var tooltip = (<div>{this.props.text.remove}</div>);

        return (
            <div className="miit-component wall-list-item-comment-list-item">
                <div className="wall-comment-avatar">
                    <UserAvatar user={user} />
                </div>
                
                <div className="wall-comment-message">
                    <span className="wall-comment-author">
                        {name}
                        <span className="wall-comment-date">
                            <DateFormat date={createdAt} from={true} />
                        </span>
                    </span>
                    <p>{comment.text}</p>
                </div>

                <If test={UserStore.isItMe(comment.author) || UserStore.isAdmin()}>
                    <Tooltip position="left" content={tooltip} className="wall-comment-remove">
                        <span onClick={this._onRemoveComment}><i className="fa fa-times mr5"></i></span>
                    </Tooltip>
                </If>
            </div>
        );
    }
});

module.exports = WallListItemCommentListItem;
