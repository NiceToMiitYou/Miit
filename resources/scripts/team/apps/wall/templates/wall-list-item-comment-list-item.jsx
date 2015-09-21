'use strict';

// Include core requirements
var UserStore            = MiitApp.require('core/stores/user-store'),
    TeamStore            = MiitApp.require('core/stores/team-store'),
    ModalActions         = MiitApp.require('core/actions/modal-actions'),
    NotificationsActions = MiitApp.require('core/actions/notifications-actions');

// Include common templates
var If         = MiitApp.require('templates/if.jsx'),
    Tooltip    = MiitApp.require('templates/tooltip.jsx'),
    DateFormat = MiitApp.require('templates/date-format.jsx');

// Include components
var TextParser = MiitApp.require('core/templates/components/text-parser.jsx'),
    UserAvatar = MiitApp.require('core/templates/user/user-avatar.jsx');

// Include requirements
var WallActions = require('wall-actions');

var WallListItemCommentListItem = React.createClass({
    getDefaultProps: function () {
        return {
            question: '',
            comment:  {},
            text: {
                alert: {
                    title:   'Suppression d\'un commentaire',
                    content: 'Voulez-vous vraiment supprimer le commentaire?'
                },
                remove:  'Supprimer',
                removed: 'Le commentaire a bien été supprimée.'
            }
        };
    },

    _onClickRemove: function() {
        var question = this.props.question,
            comment  = this.props.comment.id;
    
        if(
            true === UserStore.isItMe(question.user) ||
            true === UserStore.isAdmin()
        ) {
            var result = WallActions.uncomment(question, comment);;

            if(true === result) {
                NotificationsActions.notify('success', this.props.text.removed);
            }
        }
    },

    onClickRemove: function() {
        var title    = this.props.text.alert.title,
            content  = this.props.text.alert.content,
            onAgree  = this._onClickRemove;

        ModalActions.alert(title, content, onAgree);
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
                    <p>
                        <TextParser text={comment.text} />
                    </p>
                </div>

                <If test={UserStore.isItMe(comment.author) || UserStore.isAdmin()}>
                    <Tooltip position="left" content={tooltip} className="wall-comment-remove">
                        <span onClick={this.onClickRemove}><i className="fa fa-times mr5"></i></span>
                    </Tooltip>
                </If>
            </div>
        );
    }
});

module.exports = WallListItemCommentListItem;
