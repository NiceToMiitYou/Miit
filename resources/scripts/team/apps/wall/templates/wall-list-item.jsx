'use strict';

// Include core requirements
var UserStore            = MiitApp.require('core/stores/user-store'),
    TeamStore            = MiitApp.require('core/stores/team-store'),
    NotificationsActions = MiitApp.require('core/actions/notifications-actions');

// Include common templates
var If         = MiitApp.require('templates/if.jsx'),
    Dropdown   = MiitApp.require('templates/dropdown.jsx'),
    DateFormat = MiitApp.require('templates/date-format.jsx');

// Include core templates
var UserAvatar = MiitApp.require('core/templates/user/user-avatar.jsx');

// Include requirements
var WallStore   = require('wall-store'),
    WallActions = require('wall-actions');

//Include template
var WallListItemActions      = require('templates/wall-list-item-actions.jsx'),
    WallListItemCommentsList = require('templates/wall-list-item-comment-list.jsx');

var WallListItem = React.createClass({
    getDefaultProps: function () {
        return {
            question: {},
            user:     '',
            text: {
                tags:            'Tags',
                remove:          'Supprimer',
                removed:         'La question a bien été supprimée.',
                anchor:          'Ancrer en haut',
                allow:           'Autoriser les commentaires',
                allowed:         'Les commentaires sont désormais autorisés.',
                disallow:        'Interdire les commentaires',
                disallowed:      'Les commentaires sont désormais interdis.',
                mark_answered:   'Marquer comme répondu',
                answered:        'La question à bien été marquée comme répondue.',
                mark_unanswered: 'Marquer comme non répondu',
                unanswered:      'La question à bien été marquée comme non répondue.'
            }
        };
    },

    componentDidMount: function() {
        WallStore.addQuestionRefreshedListener(this._onChange);
    },

    componentWillUnmount: function() {
        WallStore.removeQuestionRefreshedListener(this._onChange);
    },

    _onChange: function(id) {
        var question = this.props.question;

        if(id === question.id) {
            this.forceUpdate();
        }
    },

    onClickRemove: function() {
        var question = this.props.question;

        if(
            true === UserStore.isItMe(question.user) ||
            true === UserStore.isAdmin()
        ) {
            var result = WallActions.remove(question.id);

            if(true === result) {
                NotificationsActions.notify('success', this.props.text.removed);
            }
        }
    },

    onClickAllow: function() {
        var question = this.props.question;

        if(
            true === UserStore.isItMe(question.user) ||
            true === UserStore.isAdmin()
        ) {
            var result = WallActions.allow(question.id);

            if(true === result) {
                NotificationsActions.notify('success', this.props.text.allowed);
            }
        }
    },

    onClickDisallow: function() {
        var question = this.props.question;

        if(
            true === UserStore.isItMe(question.user) ||
            true === UserStore.isAdmin()
        ) {
            var result = WallActions.disallow(question.id);

            if(true === result) {
                NotificationsActions.notify('success', this.props.text.disallowed);
            }
        }
    },

    onClickAnswered: function() {
        var question = this.props.question;

        if(
            true === UserStore.isItMe(question.user) ||
            true === UserStore.isAdmin()
        ) {
            var result = WallActions.answered(question.id);

            if(true === result) {
                NotificationsActions.notify('success', this.props.text.answered);
            }
        }
    },

    onClickUnanswered: function() {
        var question = this.props.question;

        if(
            true === UserStore.isItMe(question.user) ||
            true === UserStore.isAdmin()
        ) {
            var result = WallActions.unanswered(question.id);

            if(true === result) {
                NotificationsActions.notify('success', this.props.text.unanswered);
            }
        }
    },

    render: function() {
        var question      = this.props.question,
            text          = question.text,
            allowComments = question.allowComments,
            answered      = question.answered,
            createdAt     = question.createdAt;

        var user = TeamStore.getUser(question.user),
            name = UserStore.getName(user);

        var classes = classNames('miit-component wall-list-item', (answered) ? 'answered' : '');

        return (
            <div className={classes}>
                <div className="wall-list-item-inner">
                    <div className="wall-item-avatar">
                        <UserAvatar user={user} />
                    </div>

                    <div className="wall-item-question">
                        <span className="wall-item-author">
                            {name}
                            <span className="wall-item-date">
                                <DateFormat date={createdAt} from={true} />
                            </span>
                        </span>
                        <p>{text}</p>
                    </div>

                    <WallListItemActions question={question} />

                    <If test={allowComments}>
                        <WallListItemCommentsList question={question.id} comments={question.comments} />
                    </If>
                </div>

                <If test={UserStore.isItMe(question.user) || UserStore.isAdmin()}>
                    <Dropdown className="wall-list-item-config">
                        <span onClick={this.onClickAnchor}>
                            <i className="fa fa-anchor pull-left"></i> {this.props.text.anchor}
                        </span>
                        
                        <If test={!allowComments}>
                            <span onClick={this.onClickAllow}>
                                <i className="fa fa-comment pull-left"></i> {this.props.text.allow}
                            </span>
                        </If>
                        
                        <If test={allowComments}>
                            <span onClick={this.onClickDisallow}>
                                <i className="fa fa-comment pull-left"></i> {this.props.text.disallow}
                            </span>
                        </If>
                        
                        <If test={!answered}>
                            <span onClick={this.onClickAnswered}>
                                <i className="fa fa-check pull-left"></i> {this.props.text.mark_answered}
                            </span>
                        </If>
                        
                        <If test={answered}>
                            <span onClick={this.onClickUnanswered}>
                                <i className="fa fa-check pull-left"></i> {this.props.text.mark_unanswered}
                            </span>
                        </If>

                        <span onClick={this.onClickRemove}>
                            <i className="fa fa-trash pull-left"></i> {this.props.text.remove}
                        </span>
                    </Dropdown>
                </If>
            </div>
        );
    }
});

module.exports = WallListItem;
