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
            selected: false,
            onChange: function(){}
        };
    },

    render: function() {
        // Get answer
        var answer   = this.props.answer,
            question = this.props.question,
            selected = this.props.selected;

        var inputType = (1 === question.kind) ? 'radio' : 'checkbox';

        return (
            <div className="miit-component quiz-show-answers-item">
                <label>
                    <If test={1 === question.kind || 2 === question.kind}>
                        <input name={'choice-' + question.id} value={answer.id} checked={selected} onChange={this.props.onChange} type={inputType} />
                    </If>

                    {answer.title}
                </label>

                <If test={2 === answer.kind}>
                    <input type="text" name={'answer-' + question.id + '-' + answer.id} onChange={this.props.onChange} />
                </If>
            </div>
        );
    }
});

module.exports = QuizShowAnswersItem;
