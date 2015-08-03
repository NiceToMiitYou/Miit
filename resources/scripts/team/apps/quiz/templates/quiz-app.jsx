'use strict';

// Include core requirements
var TeamStore = MiitApp.require('core/stores/team-store');

// Include requirements
var QuizActions = require('quiz-actions');

var QuizApp = React.createClass({
    getDefaultProps: function () {
        return {
            title: 'Quiz'
        };
    },

    componentWillMount: function () {
        QuizActions.refresh();  
    },

    render: function() {
        if(false === TeamStore.hasApplication('APP_QUIZ')) {
            return <Login />;
        }

        return (
            <div className="miit-component quiz-app">
            </div>
        );
    }
});

module.exports = QuizApp;
