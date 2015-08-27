'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store');

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx'),
    Dropdown = MiitApp.require('templates/dropdown.jsx');

// Include templates
var QuizUpdateAnswersItem = require('templates/quiz-update-answers-item.jsx');

var QuizUpdateAnswers = React.createClass({
    getDefaultProps: function () {
        return {
            quiz:     '',
            question: '',
            text: {
                title:         'Réponses',
                create_answer: 'Ajouter une réponse',
                types: {
                    classic: 'Réponse classique',
                    open:    'Réponse ouverte'
                }
            },
            answers: []
        };
    },

    getInitialState: function () {
        var answers = this.props.answers;

        return {
            answers:    answers || [],
            kind:       1,
            asked_new:  0,
            to_create:  null
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var answers   = nextProps.answers,
            to_create = this.state.to_create;

        if(
            to_create && Array.isArray(answers) && answers.length > 0
        ) {
            var latestAnswer = answers[answers.length - 1];

            // If this is the same question, remove it
            if(to_create.title.trim() === latestAnswer.title) {
                to_create = null;
            }
        }

        this.setState({
            answers:   answers || [],
            to_create: to_create
        });

        if(
            1 === this.state.asked_new || 
            0  <  this.state.asked_new && !to_create
        ) {
            setTimeout(this.handleCreateAnswer.bind(this, this.state.kind));
        }
    },

    handleCreateAnswer: function(kind, e) {
        if(e) {
            e.preventDefault();
        }

        // If the there is a not created answer
        if(this.state.to_create) {

            // Save all
            this.saveAll();

            // Remember choices
            this.setState({
                kind:      kind,
                asked_new: this.state.asked_new + 1
            });
            return;
        }

        // Define a new answer
        var answer = {
            id:    'new',
            title: '',
            kind:  kind,
            order: this.state.answers.length
        };

        // Refresh
        this.setState({
            kind:      kind,
            to_create: answer,
            asked_new: 0
        });
    },

    handleToCreateChange: function(title) {
        var to_create = this.state.to_create;

        // If the latest question is not created, do not add more questions
        if(!to_create) {
            return;
        }

        // Define a new question
        to_create.title = title;

        // Refresh
        this.setState({
            to_create: to_create
        });
    },

    handleRemoveNotSaved: function() {
        // Refresh
        this.setState({
            to_create: null
        });
    },

    saveAll: function() {
        var refs = this.refs;

        for(var i in refs) {
            refs[i].handleSubmit();
        }
    },

    render: function() {
        // Get answers
        var answers    = this.state.answers,
            to_create  = this.state.to_create,
            questionId = this.props.question,
            counter    = 0;

        // Generate new Key for react
        var newKey = 'answer-' + questionId + '-new';

        return (
            <div className="miit-component quiz-update-answers">
                
                <div className="list">

                    {answers.map(function(answer) {
                        var key = 'answer-' + questionId + '-' + answer.id;

                        counter++;

                        return <QuizUpdateAnswersItem ref={key} key={key} counter={counter} answer={answer} quiz={this.props.quiz} question={questionId} />;
                    }, this)}

                    <If test={to_create}>
                        <QuizUpdateAnswersItem ref={newKey} key={newKey} counter={counter + 1} answer={to_create} quiz={this.props.quiz} question={questionId} removeNew={this.handleRemoveNotSaved} onChange={this.handleToCreateChange} />
                    </If>
                </div>

                    <Dropdown label={this.props.text.create_answer} className="btn-dropdown ml20">
                        <ul>
                            <li onClick={this.handleCreateAnswer.bind(this, 1)} >{this.props.text.types.classic} <i className="pull-right fa fa-info-circle"></i></li>
                            <li onClick={this.handleCreateAnswer.bind(this, 2)}>{this.props.text.types.open} <i className="pull-right fa fa-info-circle"></i></li>
                        </ul>
                    </Dropdown>
            </div>
        );
    }
});

module.exports = QuizUpdateAnswers;
