'use strict';

// Include requirements
var TeamStore = require('core/stores/team-store');

// Include common
var If = require('templates/if.jsx');

// Include components
var ApplicationListHeader = require('./application-list-header.jsx'),
    ApplicationListItem   = require('./application-list-item.jsx');

var ApplicationList = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                empty: 'Il n\'y a pas d\'applications dans votre Miit.'
            }
        };
    },

    render: function() {
        var applications = TeamStore.getTeam().applications || [];

        return (
            <div className="miit-component application-list">
                <ApplicationListHeader />

                {applications.map(function(application) {
                    return (<ApplicationListItem key={'app-list-' + application.identifier} application={application} />);
                })}
                <If test={0 === applications.length}>
                    <span>
                        {this.props.text.empty}
                    </span>
                </If>
            </div>
        );
    }
});

module.exports = ApplicationList;