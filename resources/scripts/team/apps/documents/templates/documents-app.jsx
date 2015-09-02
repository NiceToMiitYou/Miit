'use strict';

// Include core requierments
var PageStore = MiitApp.require('core/stores/page-store');

// Include requirements
var DocumentsStore   = require('documents-store'),
    DocumentsActions = require('documents-actions');

// Include templates
var DocumentsList = require('templates/documents-list.jsx');

var DocumentsApp = React.createClass({
    getInitialState: function () {
        return {
            page: null
        };
    },

    componentWillMount: function () {
        DocumentsActions.refresh();  
    },

    componentDidMount: function() {
        PageStore.addPageChangedListener(this._onChange);
        this._onChange();
    },

    componentWillUnmount: function() {
        PageStore.removePageChangedListener(this._onChange);
    },

    _onChange: function() {
        if(this.isMounted()) {
            var page = PageStore.getCurrentApplicationPage();

            this.setState({
                page: page || DocumentsList
            });
        }
    },

    render: function() {
        var Page = this.state.page;

        if(null === Page) {
            return null;
        }

        return (
            <div className="miit-component miit-app documents-app container-fluid">
                <Page ref="page" />
            </div>
        );
    }
});

module.exports = DocumentsApp;
