'use strict';

// Include requirements
var PageStore = require('core/stores/page-store');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

// Include not found page
var NotFound = require('./not-found.jsx');

function generateDefaultMainPage(main, title) {

    return React.createClass({
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
            if(this.isMounted() && main === PageStore.getCurrentMainPageIdentifier()) {
                var page = PageStore.getCurrentApplicationPage();

                this.setState({
                    page: page
                });
            }
        },

        render: function() {
            var Page = this.state.page;

            if(null === Page) {
                return <NotFound />;
            }

            return (
                <Layout>
                    <Page ref="page" />
                </Layout>
            );
        }
    });
}
module.exports = generateDefaultMainPage;