'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store'),
    TeamStore  = MiitApp.require('core/stores/team-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx'),
    Dropdown = MiitApp.require('templates/dropdown.jsx');

//Include template
var WallListItemActions = require('templates/wall-list-item-actions.jsx'),
    WallListItemCommentsList = require('templates/wall-list-item-comment-list.jsx');

var WallListItem = React.createClass({
    getDefaultProps: function () {
        return {
            question: {},
            user:     '',
            text: {
                remove:              'Supprimer',
                anchor:              'Ancrer en haut',
                tags:                'Tags',
                allowComments:       'Autoriser les commentaires',
                notAllowComments:    'Interdire les commentaires',
                answered:            'marquer comme repondu'
            }
        };
    },

    onClickRemove: function() {
        
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
                <If test={UserStore.isItMe(question.author) || UserStore.isAdmin()}>
                    <Dropdown className="wall-list-item-config">
                        <span onClick={this.onClickAnchor}><i className="fa fa-anchor pull-left"></i> {this.props.text.anchor}</span>
                        <If test={allowComments}>
                            <span onClick={this.onClickAllowComments}><i className="fa fa-comment pull-left"></i> {this.props.text.allowComments}</span>
                        </If>
                        <If test={!allowComments}>
                            <span onClick={this.onClickNotAllowComments}><i className="fa fa-comment pull-left"></i> {this.props.text.notAllowComments}</span>
                        </If>
                        <span onClick={this.onClickAnswered}><i className="fa fa-check pull-left"></i> {this.props.text.answered}</span>
                        <ul className="tag-names">
                            <li className="label"><i className="fa fa-tag"></i>{this.props.text.tags}</li>
                            <li><i className="fa fa-circle stat-open"></i><span>Libele 1</span></li>
                            <li><i className="fa fa-circle stat-ready"></i><span>Libele 2</span></li>
                        </ul>
                        <span onClick={this.onClickRemove}><i className="fa fa-trash pull-left"></i> {this.props.text.remove}</span>
                    </Dropdown>
                </If>
            </div>
        );
    }
});

module.exports = WallListItem;
