'use strict';

// Include core requirements
var UserStore    = MiitApp.require('core/stores/user-store'),
    ModalActions = MiitApp.require('core/actions/modal-actions');

// Include common templates
var If      = MiitApp.require('templates/if.jsx'),
    Loading = MiitApp.require('templates/loading.jsx');

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
                no_question:  'Aucune question n\'a été posée pour le moment.',
                load_more:    'Charger plus de questions.'
            }
        };
    },

    getInitialState: function () {
        return {
            anchors:   [],
            questions: WallStore.getQuestions(),
            loadMore:  true,
            loading:   true
        };
    },

    componentDidMount: function() {
        WallStore.addQuestionsRefreshedListener(this._onChange);
    },

    componentWillUnmount: function() {
        WallStore.removeQuestionsRefreshedListener(this._onChange);
    },

    _onChange: function(refreshed) {
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
            questions: questions,
            loadMore:  0 !== refreshed,
            loading:   false
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

    _onLoadMore: function() {
        var questions = this.state.questions;

        if(0 !== questions.length) {
            var last = questions[questions.length - 1];

            WallActions.questions(last.createdAt, 20);

            this.setState({
                loading: true
            });
        }
    },

    render: function() {
        var questions = this.state.questions,
            anchors   = this.state.anchors,
            loadMore  = this.state.loadMore,
            loading   = this.state.loading;

        return (
            <div className="miit-component wall-list">
                <div className="page-title mb25">
                    <h2>{this.props.text.title}</h2>
                </div>
                
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
                    <If test={0 !== questions.length && loadMore && !loading}>
                        <span className="load-more" onClick={this._onLoadMore}>{this.props.text.load_more}</span>
                    </If>
                    <If test={loading}>
                        <span className="load-more"><Loading /></span>
                    </If>
                </div>
            </div>
        );
    }
});

module.exports = WallList;
