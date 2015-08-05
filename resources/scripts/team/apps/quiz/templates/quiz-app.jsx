'use strict';

// Include core requirements
var TeamStore = MiitApp.require('core/stores/team-store'),
    UserStore = MiitApp.require('core/stores/user-store'),
    PageStore = MiitApp.require('core/stores/page-store');

// Include requirements
var QuizActions = require('quiz-actions');

// Include templates
var QuizList    = require('templates/quiz-list.jsx');

var QuizApp = React.createClass({
    getInitialState: function () {
        return {
            page: null
        };
    },

    componentWillMount: function () {
        QuizActions.refresh();  
    },

    componentDidMount: function() {
        PageStore.addPageChangedListener(this._onChange);
        this._onChange();
    },

    componentWillUnmount: function() {
        PageStore.removePageChangedListener(this._onChange);
    },

    _onChange: function() {
        if(this.isMounted()) {
            var page = PageStore.getCurrentApplicationPage();

            if(!page)
            {
                this.setState({
                    page: <QuizList />
                });
            }
            else
            {
                this.setState({
                    page: page
                });
            }
        }
    },

    render: function() {
        return (
            <div className="miit-component quiz-app">
                {this.state.page}
            </div>
        );
    }
});

module.exports = QuizApp;
