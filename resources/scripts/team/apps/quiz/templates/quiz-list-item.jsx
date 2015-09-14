'use strict';

// Include core requirements
var Router    = MiitApp.require('core/lib/router'),
    UserStore = MiitApp.require('core/stores/user-store');

// Include requirements
var QuizStore = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include core templates
var Link = MiitApp.require('core/templates/components/link.jsx');

var QuizListItem = React.createClass({
    getDefaultProps: function () {
        return {
            quiz: {},
            text: {
                stats:    'Statistiques',
                update:   'Modifier',
                answered: 'Répondre'
            }
        };
    },

    render: function() {
        var quiz = this.props.quiz;

        if(!UserStore.isAdmin() && 0 === quiz.questions.length) {
            return null;
        }

        var classes = classNames('miit-component quiz-list-item col-md-6', (QuizStore.isAnswered(quiz.id))? 'done' : '', (quiz.closed) ? 'closed' : '');
 
        return (
            <div className={classes}>
                <div className="quiz-list-item-inner hover-layer">
                    <div className="hover-layer-overlay"></div>
                    <h3 >{quiz.name}</h3>
                    <p>{quiz.description}</p>

                    <div className="actions hover-layer-content">
                        <If test={UserStore.isAdmin() && 0 !== quiz.questions.length}>
                            <Link href={'#/quiz/stats/' + quiz.id} className="mr25"><i className="fa fa-bar-chart mr5"></i>{this.props.text.stats}</Link>
                        </If>
                        <If test={UserStore.isAdmin()}>
                            <Link href={'#/quiz/update/' + quiz.id} className="mr25"><i className="fa fa-pencil mr5"></i>{this.props.text.update}</Link>
                        </If>
                        <If test={0 !== quiz.questions.length}>
                            <Link href={'#/quiz/show/' + quiz.id}><i className="fa fa-check-square-o mr5"></i>{this.props.text.answered}</Link>
                        </If>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = QuizListItem;
