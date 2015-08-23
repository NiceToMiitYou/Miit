'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store'),
    TeamStore  = MiitApp.require('core/stores/team-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

//Include template
var WallListItemActions = require('templates/wall-list-item-actions.jsx'),
    WallListItemCommentsList = require('templates/wall-list-item-comment-list.jsx');

var WallListItem = React.createClass({
    getDefaultProps: function () {
        return {
            question: {},
            user:     '',
            text: {
                
            }
        };
    },

    render: function() {
        var question        = this.props.question;
        var text            = this.props.question.text;
        var allowComments   = this.props.question.allowComments;

        var user      = TeamStore.getUser(question.author.id);
        var name      = UserStore.getName(user);

        return (
            <div className="miit-component wall-list-item">
                <div className="wall-list-item-inner">
                    <div className="wall-item-avatar">
                        <img src="https://ladygeekgirl.files.wordpress.com/2012/06/gay-super-hero.jpg"/>
                    </div>
                    <div className="wall-item-question">
                        <span className="wall-item-author">{name}<span className="wall-item-date">à 22h12</span></span>
                        <p>{text}</p>
                    </div>
                    <WallListItemActions likes={question.likes} />

                    <If test={allowComments}>
                        <WallListItemCommentsList comments={question.comments} />
                    </If>
                </div>
            </div>
        );
    }
});

module.exports = WallListItem;
