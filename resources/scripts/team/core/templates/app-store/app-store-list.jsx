'use strict';

// Include requirements
var TeamStore = require('core/stores/team-store');

// Include components
var AppStoreListHeader = require('./app-store-list-header.jsx'),
    AppStoreListItem   = require('./app-store-list-item.jsx');

var AppStoreList = React.createClass({
    getApplicationsList: function() {
        var apps = [];

        var applications = MiitApp.shared.get('applications');

        for(var i in applications) {
            apps.push(applications[i]);
        }

        return apps;
    },

    render: function() {
        var applications = this.getApplicationsList();

        return (
            <div className="miit-component app-store-list">
                <AppStoreListHeader />

                {applications.map(function(application) {
                    return (<AppStoreListItem key={'app-store-' + application.identifier} application={application} />);
                })}
            </div>
        );
    }
});

module.exports = AppStoreList;