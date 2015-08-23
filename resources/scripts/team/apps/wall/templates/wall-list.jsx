'use strict';

// Include core requirements
var UserStore    = MiitApp.require('core/stores/user-store');

// Include requirements
var WallStore = require('wall-store');
//Include template
var WallListItem = require('templates/wall-list-item.jsx');

var WallList = React.createClass({
    componentDidMount: function() {
    },

    componentWillUnmount: function() {
    },

    _onChange: function() {
        this.forceUpdate();
    },

    getDefaultProps: function () {
        return {
            text: {
                title:  'Mur de questions'
            },
            questions: [
                {
                    id:        "1",
                    author:    UserStore.getUser(),
                    text:      "Qui est Batman ?",
                    likes:      1,
                    allowComments : true,
                    comments:  [
                        {
                            id:        "1",
                            author:    UserStore.getUser(),
                            text:      "C'est moi !"
                        },
                        {
                            id:        "2",
                            author:    UserStore.getUser(),
                            text:      "Enfin je pense..."
                        },
                        {
                            id:        "3",
                            author:    UserStore.getUser(),
                            text:      "Alors ? c'est moi ou pas ?"
                        }
                    ]
                },

                {
                    id:   "3",
                    author: UserStore.getUser(),
                    text: "Et superman il fait quoi ?",
                    likes:  2,
                    allowComments : false,
                    comments:  [
                        {
                            id:        "8",
                            author:    UserStore.getUser(),
                            text:      "Batman à mis de crypto dans son slip ! LoL"
                        }
                    ]
                },

                {
                    id:   "2",
                    author: UserStore.getUser(),
                    text: "Robin est-il gay ?",
                    likes:  912,
                    allowComments : true,
                    comments:  [
                        {
                            id:        "4",
                            author:    UserStore.getUser(),
                            text:      "Très bonne question !"
                        },
                        {
                            id:        "5",
                            author:    UserStore.getUser(),
                            text:      "Enfin une question interessante !"
                        },
                        {
                            id:        "6",
                            author:    UserStore.getUser(),
                            text:      "Oui, moi aussi je voudrais savoir"
                        },
                        {
                            id:        "7",
                            author:    UserStore.getUser(),
                            text:      "Il serait temps qu'on nous dise la vérité !!"
                        }
                    ]
                }
            ]
        };
    },

    render: function() {

        var questions = this.props.questions;

        console.log(questions);

        return (
            <div className="miit-component wall-list">
                <h2 className="mt25 mb20">{this.props.text.title}</h2>
                
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
