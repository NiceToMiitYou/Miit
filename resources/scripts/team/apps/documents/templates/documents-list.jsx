'use strict';

// Include core requirements
var UserStore     = MiitApp.require('core/stores/user-store'),
    UploadStore   = MiitApp.require('core/stores/upload-store'),
    ModalActions  = MiitApp.require('core/actions/modal-actions'),
    UploadActions = MiitApp.require('core/actions/upload-actions');

// Include requirements
var DocumentsStore = require('documents-store');

//Include template
var DocumentsListItem = require('templates/documents-list-item.jsx'),
    DocumentsUpload   = require('templates/documents-upload.jsx');

var DocumentsList = React.createClass({
    UploadToken: null,

    getDefaultProps: function () {
        return {
            text: {
                title:   'Documents',
                name:    'Nom', 
                size:    'Taille', 
                type:    'Type', 
                actions: 'Actions',
                upload:  'Envoyer un fichier'
            },
            identifier: 'APP_DOCUMENTS'
        };
    },

    componentDidMount: function() {
        DocumentsStore.addDocumentsRefreshedListener(this._onChange);
        UploadStore.addCreatedListener(this._onUpload);
    },

    componentWillUnmount: function() {
        DocumentsStore.removeDocumentsRefreshedListener(this._onChange);
        UploadStore.removeCreatedListener(this._onUpload);
    },

    _onChange: function() {
        this.forceUpdate();
    },

    _onUpload: function(token, upload) {
        if(token === this.UploadToken) {
            var identifier = this.props.identifier;

            ModalActions.open('document-upload', <DocumentsUpload upload={upload} application={identifier} />, {
                title: this.props.text.upload,
                size:  'small'
            });
        }
    },

    onUpload: function() {
        this.UploadToken = UploadActions.create(this.props.identifier);
    },


    render: function() {
        var documents = DocumentsStore.getDocuments();

        return (
            <div className="miit-component documents-list">
                <h2 className="mt25 mb20">{this.props.text.title}</h2>
                
                <button type="button"  className="btn btn-info pull-left ml20" onClick={this.onUpload} >
                    <i className="fa fa-plus mr5"></i> {this.props.text.upload}
                </button>

                <div className="list">

                    <div className="documents-list-header">
                        <span></span>
                        <span className="document-name">{this.props.text.name}</span>
                        <span className="document-size">{this.props.text.size}</span>
                        <span className="document-type">{this.props.text.type}</span>
                        <span className="document-actions pl25">{this.props.text.actions}</span>
                    </div>

                    {documents.map(function(document) {
                        return <DocumentsListItem key={'documents-document-' + document.id} document={document} />;
                    })}
                </div>
            </div>
        );
    }
});

module.exports = DocumentsList;
