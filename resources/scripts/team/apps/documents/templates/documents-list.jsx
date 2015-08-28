'use strict';

// Include core requirements
var UserStore    = MiitApp.require('core/stores/user-store');

// Include requirements
//var DocumentsStore = require('documents-store');

//Include template
var DocumentsListItem = require('templates/documents-list-item.jsx');

var DocumentsList = React.createClass({
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
                title:  'Documents'
            },
            documents: [
                {
                    id:          "1",
                    author:      UserStore.getUser(),
                    name:        "Fichier 1",
                    description: "Cours sur le php",
                    public:      true,
                    type:        "pdf"
                },

                {
                    id:   "2",
                    author:      UserStore.getUser(),
                    name:        "Fichier 2",
                    description: "Carte de la zone",
                    public:      false,
                    type:        "png"
                }
            ]
        };
    },

    render: function() {

        var documents = this.props.documents;

        return (
            <div className="miit-component documents-list">
                <h2 className="mt25 mb20">{this.props.text.title}</h2>
                
                <div className="list">
                    {documents.map(function(document) {
                        return <DocumentsListItem key={'doc-' + document.id} document={document} />;
                    })}
                </div>
            </div>
        );
    }
});

module.exports = DocumentsList;
