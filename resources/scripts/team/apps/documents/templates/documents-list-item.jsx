'use strict';

// Include core requirements
var filesize     = MiitApp.require('core/lib/filesize'),
    UserStore    = MiitApp.require('core/stores/user-store'),
    ModalActions = MiitApp.require('core/actions/modal-actions');

// Include requirements
var DocumentsActions = require('documents-actions');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var DocumentsListItem = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                title:    'Documents',
                download: 'Télecharger',
                remove:   'Supprimer',
                alert: {
                    title:   'Suppression d\'un document',
                    content: 'Voulez-vous vraiment supprimer le document?'
                }
            },
            document:   {},
            identifier: ''
        };
    },

    _onRemove: function() {
        var document = this.props.document;
        
        DocumentsActions.remove(document.id);
    },

    onRemove: function() {
        var title    = this.props.text.alert.title,
            content  = this.props.text.alert.content,
            onAgree  = this._onRemove;

        ModalActions.alert(title, content, onAgree);
    },

    onDownload: function() {
        var document   = this.props.document,
            identifier = this.props.identifier;

        DocumentsActions.download(document.id);
    },

    render: function() {
        var document = this.props.document;

        var name = document.file.name,
            icon = document.file.icon;

        // Add {suffixes: {B: 'o', KB: 'Ko', MB: 'Mo', GB: 'Go'}} to translate in french (later)
        var size = filesize(document.file.size);

        var classesIcon = classNames('fa', 'fa-' + icon);

        return (
            <div className="miit-component documents-list-item">
                <span className="document-icon mr15">
                    <i className={classesIcon} />
                </span>
                
                <span className="document-name">{name}</span>
                <span className="document-size">{size}</span>
                
                <span className="document-actions right">
                    <span className="action-download text-blue mr20" onClick={this.onDownload}>
                        <i className="fa fa-download mr5"></i>{this.props.text.download}
                    </span>
                    <If test={UserStore.isAdmin()}>
                        <span className="action-delete text-red" onClick={this.onRemove}>
                            <i className="fa fa-trash mr5"></i>{this.props.text.remove}
                        </span>
                    </If>
                </span>
            </div>
        );
    }
});

module.exports = DocumentsListItem;
