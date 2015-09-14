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
            text: {
                title: 'Cette page n\'existe pas.',
                home:  'Retour à l\'accueil'
            }
        };
    },

    render: function() {
        return (
            <Layout>
                <div className="container-fluid">
                    <div className="page-title">
                        <h2>
                            <i className="fa fa-exclamation pull-left mr15"></i> {this.props.text.title}
                        </h2>
                    </div>

                    <div className="mt50">
                        <Link href="/">{this.props.text.home}</Link>
                    </div>
                </div>
            </Layout>
        );
    }
});

PageStore.registerMainPage('not-found', NotFound);

module.exports = NotFound;