'use strict';

// Include requirements
var PageStore = require('core/stores/page-store');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

// Include components
var Link = require('core/templates/components/link.jsx');

var NotFound = React.createClass({
    getDefaultProps: function () {
        return {
            title: 'Cette page n\'existe pas.',
            text: {
                home: 'Retour à l\'accueil'
            }
        };
    },

    render: function() {
        return (
            <Layout>
                <h1 className="pt25">{this.props.title}</h1>

                <div className="mt50">
                    <Link href="/">{this.props.text.home}</Link>
                </div>
            </Layout>
        );
    }
});

PageStore.registerMainPage('not-found', NotFound);

module.exports = NotFound;