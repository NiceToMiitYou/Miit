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
                stats:         'Statistiques',
                update:        'Modifier',
                answered:      'Répondre',
                answer:        'Réponse(s)',
                nodescription: 'Ce questionnaire n\'a pas de description.',
                noquestions:   'Ce questionnaire est vide.'
            }
        };
    },

    render: function() {
        var quiz = this.props.quiz;

        if(!UserStore.isAdmin() && 0 === quiz.questions.length) {
            return null;
        }

        var classes = classNames('miit-component quiz-list-item col-md-6 col-lg-4', (QuizStore.isAnswered(quiz.id))? 'done' : '', (quiz.closed) ? 'closed' : '');
 
        return (
            <div className={classes}>
                <div className="quiz-list-item-inner">
                    <div className="hover-layer-overlay"></div>
                    <h3>
                        {quiz.name}
                        <div className="actions pull-right">
                            <If test={UserStore.isAdmin()}>
                                <Link href={'#/quiz/update/' + quiz.id}><i className="fa fa-pencil"></i></Link>
                            </If>
                            <If test={UserStore.isAdmin() && 0 !== quiz.questions.length}>
                                <Link href={'#/quiz/stats/' + quiz.id}><i className="fa fa-bar-chart"></i></Link>
                            </If>
                        </div>
                    </h3>

                    <If test={quiz.description}>
                        <p>{quiz.description}</p>
                    </If>
                    <If test={!quiz.description}>
                        <p>{this.props.text.nodescription}</p>
                    </If>

                    <If test={0 !== quiz.questions.length}>
                        <div className="quiz-list-item-inner-answer">
                            <span className="pull-left">{quiz.answers + ' ' + this.props.text.answer}</span>
                            <Link href={'#/quiz/show/' + quiz.id}>{this.props.text.answered}</Link>
                        </div>
                    </If>

                    <If test={0 == quiz.questions.length}>
                        <div className="quiz-list-item-inner-answer">
                            <span className="pull-left">{this.props.text.noquestions}</span>
                        </div>
                    </If>
                </div>
            </div>
        );
    }
});

module.exports = QuizListItem;
