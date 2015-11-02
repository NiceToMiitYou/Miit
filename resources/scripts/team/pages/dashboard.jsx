'use strict';

// Include requirements
var Router    = require('core/lib/router'),
    UserStore = require('core/stores/user-store'),
    TeamStore = require('core/stores/team-store'),
    PageStore = require('core/stores/page-store');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

// Include components
var AppDescription = require('core/templates/dashboard/app-description.jsx');

var Dashboard = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                title:    'Bienvenue sur le Miit',
                subtitle: 'De nombreuses possibilités d\'interaction s\'offrent à vous.'
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

        var team  = TeamStore.getTeam(),
            apps  = (team.applications || []).filter(function(application) {
                return true === TeamStore.hasApplication(application.identifier);
            }),
            count = 0;

        return (
            <Layout>
                <div className="container-fluid dashboard center">
                    <h2 className="mt40">
                        <i className="icon-logo-miit mr10"></i>
                        {this.props.text.title} <b>&laquo; {team.name} &raquo;</b>
                    </h2>

                    <h3 className="mt40">
                        {this.props.text.subtitle}
                    </h3>

                    {apps.map(function(app) {
                        var even = 0 === count % 2;

                        count++;

                        return (
                            <AppDescription key={'app-' + app.identifier} even={even} application={app} />
                        );
                    })}
                </div>
            </Layout>
        );
    }
});

PageStore.registerMainPage('dashboard', Dashboard);

module.exports = Dashboard;