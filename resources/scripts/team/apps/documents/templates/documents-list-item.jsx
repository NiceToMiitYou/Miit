'use strict';

// Include core requirements
var UserStore    = MiitApp.require('core/stores/user-store');

// Include requirements
//var DocumentsStore = require('documents-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var DocumentsListItem = React.createClass({
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
                download:   'Télecharger',
                delete:     'Supprimer'
            }
        };
    },

    render: function() {

        var document = this.props.document;
        var icon = "fa ";

        switch(document.type) {

            case 'pdf' :
                icon += "fa-file-pdf-o";
                break;

            default:
                icon += "fa-file-o";
                break;
        }

        return (
            <div className="miit-component documents-list-item">

            <span className="document-icon mr15"><i className={icon} ></i></span>
                <span className="document-name">
                    {document.name}
                </span>
                <span className="document-size">{document.size}</span>
                <span className="document-type">{document.type}</span>
                <span className="document-actions right">
                    <If test={document.allowDownload}>
                        <span className="mr20 action-download text-blue"><i className="fa fa-download mr5"></i>{this.props.text.download}</span>
                    </If>
                    <span className="action-delete text-red"><i className="fa fa-trash mr5"></i>{this.props.text.delete}</span>
                </span>
            </div>
        );
    }
});

module.exports = DocumentsListItem;
