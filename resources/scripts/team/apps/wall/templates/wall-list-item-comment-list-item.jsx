'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store'),
    TeamStore  = MiitApp.require('core/stores/team-store');

var WallListItemCommentListItem = React.createClass({
    getDefaultProps: function () {
        return {
            comment: [],
            text: {

            }
        };
    },

    render: function() {
        var comment = this.props.comment;

        var user      = TeamStore.getUser(this.props.comment.author.id);
        var name      = UserStore.getName(user);

        return (
            <div className="miit-component wall-list-item-comment-list-item">
                <div className="wall-comment-avatar">
                    <img src="http://static.giantbomb.com/uploads/square_small/0/378/2494984-deadpool.png"/>
                </div>
                <div className="wall-comment-message">
                    <span className="wall-comment-author">{name}<span className="wall-comment-date">à 22h12</span></span>
                    <p>{comment.text}</p>
                </div>
            </div>
        );
    }
});

module.exports = WallListItemCommentListItem;
