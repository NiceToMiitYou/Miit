'use strict';

// Include requirements
var PageStore = MiitApp.require('core/stores/page-store'),
    TeamStore = MiitApp.require('core/stores/team-store');

// Include Layout
var Layout = MiitApp.require('pages/layouts/default-layout.jsx');

// Include core components
var Login = MiitApp.require('pages/login.jsx');

// Include components
var QuizApp = require('templates/quiz-app.jsx');

var QuizPage = React.createClass({
    getDefaultProps: function () {
        return {
            title: 'Quiz'
        };
    },

    render: function() {
        if(false === TeamStore.hasApplication('APP_QUIZ')) {
            return <Login />;
        }

        return (
            <Layout title={this.props.title}>
                <QuizApp />
            </Layout>
        );
    }
});

PageStore.registerMainPage('quiz', (<QuizPage />));

module.exports = QuizPage;
