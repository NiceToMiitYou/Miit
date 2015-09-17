'use strict';

// Include requirements
var Router    = require('core/lib/router'),
    UserStore = require('core/stores/user-store'),
    TeamStore = require('core/stores/team-store'),
    PageStore = require('core/stores/page-store');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

var Dashboard = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                title: 'Bienvenue sur Miit'
            }
        };
    },

    componentDidMount: function () {
        if(
            true  === UserStore.isAdmin()         &&
            false === TeamStore.hasApplications()
        ) {
            Router.setRoute('/welcome');
        }
    },

    render: function() {
        if(
            true  === UserStore.isAdmin()         &&
            false === TeamStore.hasApplications()
        ) {
            return null;
        }

        return (
            <Layout>
                <div className="container-fluid dashboard center">
                    <h2 className="mt40">
                        <i className="icon-logo-miit mr10"></i>
                        {this.props.text.title}
                    </h2>

                    <h3 className="mt40">
                        {this.props.text.subtitle}
                    </h3>

                    <p className="mt40">
                        {this.props.text.templates}
                    </p>

                    <p className="text-seperator mb20 mt20">
                        {this.props.text.or}
                    </p>

                    <p className="mb20 mt20">
                        {this.props.text.customs}
                    </p>
                </div>
            </Layout>
        );
    }
});

PageStore.registerMainPage('dashboard', Dashboard);

module.exports = Dashboard;