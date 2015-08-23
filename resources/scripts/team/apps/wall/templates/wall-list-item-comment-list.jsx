'use strict';

//Include template
var WallListItemCommentListItem = require('templates/wall-list-item-comment-list-item.jsx'),
    WallListItemCommentSend = require('templates/wall-list-item-comment-send.jsx');

var WallListItemCommentList = React.createClass({
    getDefaultProps: function () {
        return {
            comments: [],
            text: {

            }
        };
    },

    render: function() {
        var comments = this.props.comments;

        return (
            <div className="miit-component wall-list-item-comment-list">
               <div className="list">
                   {comments.map(function(comment) {
                       return <WallListItemCommentListItem key={'comment-' + comment.id} comment={comment} />;
                   })}
               </div>
               <WallListItemCommentSend />
            </div>
        );
    }
});

module.exports = WallListItemCommentList;
