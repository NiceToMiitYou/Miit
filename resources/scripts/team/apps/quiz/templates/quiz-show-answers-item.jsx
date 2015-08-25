'use strict';

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var QuizShowAnswersItem = React.createClass({
    getDefaultProps: function () {
        return {
            quiz:     '',
            question: {},
            answer:   {},
            choice:   null,
            onChange: function(){},
            text: {
                your_answer: 'Votre réponse'
            }
        };
    },

    render: function() {
        // Get answer
        var answer   = this.props.answer,
            question = this.props.question,
            choice   = this.props.choice,
            selected = !!choice;

        // Get the default value
        var value = '';

        console.log(choice);

        // If there is a choice
        if(choice && choice.text) {
            value = choice.text;
        }

        var inputType = (1 === question.kind) ? 'radio' : 'checkbox';

        var classes      = classNames('miit-component quiz-show-answers-item', 'kind-' + answer.kind),
            classesLabel = classNames((1 === question.kind || 2 === question.kind) ? 'checkbox-field' : ''),
            classesInput = classNames('option-input', inputType);

        return (
            <div className={classes}>
                <label className={classesLabel}>
                    <If test={1 === question.kind || 2 === question.kind}>
                        <input className={classesInput} name={'choice-' + question.id} value={answer.id} checked={selected} onChange={this.props.onChange} type={inputType} />
                    </If>

                    {answer.title}
                </label>

                <If test={2 === answer.kind}>
                    <input placeholder={this.props.text.your_answer} type="text" defaultValue={value} name={'answer-' + question.id + '-' + answer.id} onChange={this.props.onChange} />
                </If>
            </div>
        );
    }
});

module.exports = QuizShowAnswersItem;
