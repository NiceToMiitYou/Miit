'use strict';

// Include core requirements
var UserStore     = MiitApp.require('core/stores/user-store'),
    ModalActions  = MiitApp.require('core/actions/modal-actions'),
    UploadActions = MiitApp.require('core/actions/upload-actions');

// Include requirements
var DocumentsStore = require('documents-store');

// Include common
var If = require('templates/if.jsx');

// Include core template
var UploadList = MiitApp.require('core/templates/upload/upload-list.jsx');

// Include template
var DocumentsListItem = require('templates/documents-list-item.jsx'),
    DocumentsUpload   = require('templates/documents-upload.jsx');

var DocumentsList = React.createClass({
    UploadToken: null,

    getDefaultProps: function () {
        return {
            text: {
                title:    'Documents',
                subtitle: 'Distribuez facilement vos fichiers',
                name:     'Nom', 
                size:     'Taille', 
                type:     'Type', 
                actions:  'Actions',
                empty:    'Il n\'y a pas de documents pour le moment.'
            },
            identifier: 'APP_DOCUMENTS'
        };
    },

    componentDidMount: function() {
        DocumentsStore.addDocumentsRefreshedListener(this._onChange);
    },

    componentWillUnmount: function() {
        DocumentsStore.removeDocumentsRefreshedListener(this._onChange);
    },

    _onChange: function() {
        this.forceUpdate();
    },

    render: function() {
        var documents  = DocumentsStore.getDocuments(),
            identifier = this.props.identifier;

        return (
            <div className="miit-component documents-list">
                <div className="page-title mb30">
                    <h2>
                        <i className="fa fa-folder-open-o mr15"></i>{this.props.text.title}
                        <span className="subtitle">{this.props.text.subtitle}</span>
                    </h2>
                </div>
                
                <UploadList application={this.props.identifier} />

                <div className="list">

                    <div className="documents-list-header">
                        <span></span>
                        <span className="document-name">{this.props.text.name}</span>
                        <span className="document-size">{this.props.text.size}</span>
                        <span className="document-type">{this.props.text.type}</span>
                        <span className="document-actions pl25">{this.props.text.actions}</span>
                    </div>

                    {documents.map(function(document) {
                        return <DocumentsListItem key={'documents-document-' + document.id} document={document} identifier={this.props.identifier} />;
                    }, this)}
                </div>
                
                <If test={0 === documents.length}>
                    <div className="documents-list-empty">
                        <span>{this.props.text.empty}</span>
                    </div>
                </If>

                <If test={UserStore.isAdmin()}>
                    <DocumentsUpload application={identifier} />
                </If>
            </div>
        );
    }
});

module.exports = DocumentsList;
