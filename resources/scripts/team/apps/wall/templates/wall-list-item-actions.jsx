'use strict';

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include requirements
var WallStore   = require('wall-store'),
    WallActions = require('wall-actions');

var WallListItemActions = React.createClass({
    getDefaultProps: function () {
        return {
            question: {},
            text: {
                nbrlike:  'personne aime cette question',
                nbrlikes: 'personnes aiment cette question',
                like:     'J\'aime',
                unlike:   'Je m\'aime plus'
            }
        };
    },

    _onLike: function() {
        var question = this.props.question;

        WallActions.like(question.id);
    },

    _onUnlike: function() {
        var question = this.props.question;

        WallActions.unlike(question.id);
    },

    render: function() {
        var question = this.props.question,
            isLiked  = WallStore.isLiked(question.id),
            likes    = question.likes;

        return (
            <div className="miit-component wall-list-item-actions">
                <span className="wall-item-actions-likes">
                    <i className="fa fa-heart pull-left"></i>
                    {likes}
                    <If test={likes <= 1}>
                        <span className="ml5">{this.props.text.nbrlike}</span>
                    </If>
                    <If test={likes > 1}>
                        <span className="ml5">{this.props.text.nbrlikes}</span>
                    </If>
                </span>
                <If test={isLiked}>
                    <span className="wall-item-actions-like-button" onClick={this._onUnlike}>
                         <i className="fa mr5 fa-thumbs-o-down"></i>
                         {this.props.text.unlike}
                    </span>
                </If>
                <If test={!isLiked}>
                    <span className="wall-item-actions-like-button" onClick={this._onLike}>
                         <i className="fa mr5 fa-thumbs-o-up"></i>
                         {this.props.text.like}
                    </span>
                </If>
            </div>
        );
    }
});

module.exports = WallListItemActions;
