'use strict';

// Include core requirements
var UserStore    = MiitApp.require('core/stores/user-store'),
    ModalActions = MiitApp.require('core/actions/modal-actions');

// Include requirements
var WallStore   = require('wall-store'),
    WallActions = require('wall-actions');

//Include template
var WallListItem    = require('templates/wall-list-item.jsx'),
    WallAddQuestion = require('templates/wall-add-question.jsx');

var WallList = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                title:        'Mur de questions',
                ask_question: 'Poser une question'
            }
        };
    },

    getInitialState: function () {
        return {
            questions: WallStore.getQuestions()
        };
    },
    
    componentDidMount: function() {
        WallStore.addQuestionsRefreshedListener(this._onChange);
    },

    componentWillUnmount: function() {
        WallStore.removeQuestionsRefreshedListener(this._onChange);
    },

    _onChange: function() {
        this.setState({
            questions: WallStore.getQuestions()
        });
    },

    _onAsk: function() {
        ModalActions.open('wall-ask-question', <WallAddQuestion />, {
            title: this.props.text.ask_question,
            size:  'small'
        });
    },

    render: function() {
        var questions = this.state.questions;

        return (
            <div className="miit-component wall-list">
                <h2 className="mt25 mb20">{this.props.text.title}</h2>
                
                <button type="button" className="btn btn-info ml20" onClick={this._onAsk} >
                    <i className="fa fa-plus mr5"></i> {this.props.text.ask_question}
                </button>

                <div className="list">
                    {questions.map(function(question) {
                        return <WallListItem key={'wall-' + question.id} question={question} />;
                    })}
                </div>
            </div>
        );
    }
});

module.exports = WallList;
