'use strict';

var WallListItemCommentSend = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                placeholder  : 'Votre commentaire'
            }
        };
    },

    handleChange: function(e) {

    },

    handleSubmit: function(e) {
        e.preventDefault();

    },

    render: function() {

        return (
            <form className="miit-component wall-list-item-comment-send" onSubmit={this.handleSubmit}>
                <div className="wall-comment-send-avatar">
                    <img src="https://ladygeekgirl.files.wordpress.com/2012/06/gay-super-hero.jpg"/>
                </div>
                <label>
                    <input type="text" value="" placeholder={this.props.text.placeholder} onChange={this.handleChange} />
                </label>
                <button type="submit" className="btn btn-info pull-right"><i className="fa fa-arrow-circle-o-right"></i></button>
            </form>
        );
    }
});

module.exports = WallListItemCommentSend;
