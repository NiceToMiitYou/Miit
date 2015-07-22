'use strict';

// Include requirements
var TeamStore = require('application/stores/team-store');

// Include components
var ApplicationListHeader = require('./application-list-header.jsx'),
    ApplicationListItem   = require('./application-list-item.jsx');

var ApplicationList = React.createClass({
    render: function() {
        var applications = TeamStore.getTeam().applications || [];

        return (
            <div className="miit-component application-list">
                <ApplicationListHeader />

                {applications.map(function(application) {
                    return (<ApplicationListItem key={application.identifier} application={application} />);
                })}
            </div>
        );
    }
});

module.exports = ApplicationList;