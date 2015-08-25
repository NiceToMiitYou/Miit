'use strict';

// Include core requierments
var PageStore = MiitApp.require('core/stores/page-store');

// Include requirements
var WallStore   = require('wall-store'),
    WallActions = require('wall-actions');

// Include templates
var WallList = require('templates/wall-list.jsx');

var WallApp = React.createClass({
    getInitialState: function () {
        return {
            page: null
        };
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
                page: page || WallList
            });
        }
    },

    render: function() {
        var Page = this.state.page;

        if(null === Page) {
            return null;
        }

        return (
            <div className="miit-component miit-app wall-app container-fluid">
                <Page ref="page" />
            </div>
        );
    }
});

module.exports = WallApp;
