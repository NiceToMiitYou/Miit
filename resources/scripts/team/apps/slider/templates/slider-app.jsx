'use strict';

// Include core requierments
var PageStore = MiitApp.require('core/stores/page-store');

// Include requirements
var SliderStore   = require('slider-store'),
    SliderActions = require('slider-actions');

// Include templates
var SliderList = require('templates/slider-list.jsx');

var SliderApp = React.createClass({
    getInitialState: function () {
        return {
            page: null
        };
    },

    componentDidMount: function() {
        SliderActions.refresh();
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
                page: page || SliderList
            });
        }
    },

    render: function() {
        var Page = this.state.page;

        if(null === Page) {
            return null;
        }

        return (
            <div className="miit-component miit-app slider-app container-fluid">
                <Page ref="page" />
            </div>
        );
    }
});

module.exports = SliderApp;
