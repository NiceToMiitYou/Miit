'use strict';

// Include core requirements
var UserStore    = MiitApp.require('core/stores/user-store'),
    ModalActions = MiitApp.require('core/actions/modal-actions');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

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
                ask_question: 'Poser une question',
                no_question:  'Aucune question n\'a été posée pour le moment.'
            }
        };
    },

    getInitialState: function () {
        return {
            anchors:   [],
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
        var questions = WallStore.getQuestions(),
            anchors   = this.state.anchors,
            clean     = [];

        anchors.forEach(function(question) {
            var id = question.id;

            if(-1 !== questions.indexBy('id', id)) {
                // add to anchors if found
                clean.push(questions.findBy('id', id));
            }
        });

        this.setState({
            anchors:   clean,
            questions: WallStore.getQuestions()
        });
    },

    _onAsk: function() {
        ModalActions.open('wall-ask-question', <WallAddQuestion />, {
            title: this.props.text.ask_question,
            size:  'small'
        });
    },

    _onAnchor: function(question) {
        var anchors = this.state.anchors;

        anchors.mergeBy('id', question, true);

        this.setState({
            anchors: anchors
        });
    },

    _onUnanchor: function(question) {
        var anchors = this.state.anchors;

        anchors.removeBy('id', question.id);

        this.setState({
            anchors: anchors
        });
    },

    render: function() {
        var questions = this.state.questions,
            anchors   = this.state.anchors;

        return (
            <div className="miit-component wall-list">
                <h2 className="mt25 mb20">{this.props.text.title}</h2>
                
                <button type="button" className="btn btn-info btn-create ml20" onClick={this._onAsk} >
                    <i className="fa fa-plus mr5"></i> {this.props.text.ask_question}
                </button>

                <div className="list">
                    {anchors.map(function(question) {
                        return <WallListItem key={'wall-list-questions-question-' + question.id} question={question} onAnchor={this._onUnanchor} anchored={true} />;
                    }, this)}
                    {questions.map(function(question) {
                        if(-1 !== anchors.indexBy('id', question.id)) {
                            return null;
                        }

                        return <WallListItem key={'wall-list-questions-question-' + question.id} question={question} onAnchor={this._onAnchor} anchored={false} />;
                    }, this)}
                    <If test={0 === questions.length}>
                        <span>{this.props.text.no_question}</span>
                    </If>
                </div>
            </div>
        );
    }
});

module.exports = WallList;
