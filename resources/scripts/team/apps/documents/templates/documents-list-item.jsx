'use strict';

// Include core requirements
var UserStore    = MiitApp.require('core/stores/user-store');

// Include requirements
//var DocumentsStore = require('documents-store');

//Include template
//var DocumentsListItem = require('templates/documents-list-item.jsx');

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
                title:  'Documents'
            }
        };
    },

    render: function() {

        var document = this.props.document;

        return (
            <div className="miit-component documents-list-item">
                {document.name}
            </div>
        );
    }
});

module.exports = DocumentsListItem;
