'use strict';

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var WallListItemActions = React.createClass({
    getDefaultProps: function () {
        return {
            likes: '',
            text: {
                nbrlike  : 'personne aime cette question',
                nbrlikes : 'personnes aiment cette question',
                like     : 'J\'aime'

            }
        };
    },

    render: function() {
        var likes = this.props.likes;

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
                <span className="wall-item-actions-like-button">
                     <i className="fa mr5 fa-thumbs-o-up"></i>
                     {this.props.text.like}
                </span>
            </div>
        );
    }
});

module.exports = WallListItemActions;
