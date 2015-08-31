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
                title:      'Documents',
                name :      'Nom', 
                size :      'Taille', 
                type :      'Type', 
                actions :   'Actions'
            },
            documents: [
                {
                    id:             "1",
                    author:         UserStore.getUser(),
                    name:           "sensors-14-03188.pdf",
                    size:           "1,26 Mo",
                    allowDownload:  true,
                    description:    "Cours sur le php",
                    public:         true,
                    type:           "pdf"
                },

                {
                    id:   "2",
                    author:         UserStore.getUser(),
                    name:           "file-text_1e2d3a_100.png",
                    size:           "132 Ko",
                    allowDownload:  false,
                    description:    "Carte de la zone",
                    public:         false,
                    type:           "png"
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

                    <div className="documents-list-header">
                        <span></span>
                        <span className="document-name">{this.props.text.name}</span>
                        <span className="document-size">{this.props.text.size}</span>
                        <span className="document-type">{this.props.text.type}</span>
                        <span className="document-actions pl25">{this.props.text.actions}</span>
                    </div>

                    {documents.map(function(document) {
                        return <DocumentsListItem key={'doc-' + document.id} document={document} />;
                    })}
                </div>
            </div>
        );
    }
});

module.exports = DocumentsList;
