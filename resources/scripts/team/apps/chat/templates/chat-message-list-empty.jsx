'use strict';

var ChatMessageListEmpty = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                no_message: 'Il n\'y a pas encore de message.'
            }  
        };
    },
    render: function() {
        return (
            <div className="miit-component chat-message-list-empty">
                <i className="fa fa-comments" />
                <p>{this.props.text.no_message}</p>
                <div className="clearfix"></div>
            </div>
        );
    }
});

module.exports = ChatMessageListEmpty;
