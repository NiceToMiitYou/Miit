'use strict';

// Include core requirements
var Router    = MiitApp.require('core/lib/router'),
    UserStore = MiitApp.require('core/stores/user-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include core templates
var Link = MiitApp.require('core/templates/components/link.jsx');

var QuizListItem = React.createClass({
    getDefaultProps: function () {
        return {
            quiz: {},
            text: {
                update: 'Modifier'
            }
        };
    },

    onClickShow: function(evt) {
        var classes = evt.target.className.split(' '),
            tagName = evt.target.tagName;

        if(-1 !== classes.indexOf('actions')) {
            return;
        } else if('A' === tagName) {
            return;
        }

        var quizId = this.props.quiz.id;

        // Change the route of the application
        Router.setRoute('/quiz/show/' + quizId);
    },

    render: function() {
        var quiz = this.props.quiz;
 
        return (
            <div className="miit-component quiz-list-item" onClick={this.onClickShow}>
                <h3>{quiz.name}</h3>
                <p>{quiz.description}</p>
                <If test={UserStore.isAdmin()}>
                    <div className="actions">
                        <Link href={'#/quiz/update/' + quiz.id}>{this.props.text.update}</Link>
                    </div>
                </If>
            </div>
        );
    }
});

module.exports = QuizListItem;
