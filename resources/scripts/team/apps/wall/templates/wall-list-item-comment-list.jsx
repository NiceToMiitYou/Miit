'use strict';

//Include template
var WallListItemCommentListItem = require('templates/wall-list-item-comment-list-item.jsx'),
    WallListItemCommentSend = require('templates/wall-list-item-comment-send.jsx');

var WallListItemCommentList = React.createClass({
    getDefaultProps: function () {
        return {
            question: '',
            comments: []
        };
    },

    render: function() {
        var question = this.props.question,
            comments = this.props.comments;

        return (
            <div className="miit-component wall-list-item-comment-list">
                <div className="list">
                    {comments.map(function(comment) {
                        return <WallListItemCommentListItem key={'wall-list-comments-comment-' + comment.id} question={question} comment={comment} />;
                    })}
                </div>
                
                <WallListItemCommentSend question={question} />
            </div>
        );
    }
});

module.exports = WallListItemCommentList;
