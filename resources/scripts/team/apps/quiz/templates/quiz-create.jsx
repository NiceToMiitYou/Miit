'use strict';

// Include core requirements
var PageStore = MiitApp.require('core/stores/page-store'),
    UserStore = MiitApp.require('core/stores/user-store');

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

var QuizCreate = React.createClass({
    getInitialState: function () {
        return {
            value_name:        '',
            value_description: ''
        };
    },

    handleChange: function(e) {
        if(e.target && e.target.name) {
            var update = {};
            var name   = 'value_' + e.target.name;
            var value  = e.target.value || '';

            update[name] = value;

            this.setState(update);
        }
    },

    handleSubmit: function() {
        e.preventDefault();

        if(false === UserStore.isAdmin()) {
            return;
        }

        var name        = this.state.value_name,
            description = this.state.value_description;

        // Create the quiz
        QuizActions.create(name, description);
    },

    render: function() {
        if(false === UserStore.isAdmin()) {
            return null;
        }

        var value_name        = this.state.value_name,
            value_description = this.state.value_description;

        return (
            <div className="miit-component quiz-create">
                Create
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="name"        value={value_name}        onChange={this.handleChange} />
                    <input type="text" name="description" value={value_description} onChange={this.handleChange} />
                </form>
            </div>
        );
    }
});

module.exports = QuizCreate;
