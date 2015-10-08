'use strict';

// Include requirements
var TeamStore = require('core/stores/team-store');

// Include components
var AppStoreListHeader = require('./app-store-list-header.jsx'),
    AppStoreListItem   = require('./app-store-list-item.jsx');

// Include common
var If = require('templates/if.jsx');

var AppStoreList = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                empty: 'Il n\'y a plus d\'applications disponible.'
            }
        };
    },

    getApplicationsList: function() {
        var apps = [];

        var applications = MiitApp.shared.get('applications');

        for(var i in applications) {
            apps.push(applications[i]);
        }

        return apps;
    },

    render: function() {
        var applications = this.getApplicationsList().filter(function(application) {
            return false === TeamStore.hasApplication(application.identifier);
        });

        return (
            <div className="miit-component app-store-list">
                {applications.map(function(application) {
                    return (
                        <AppStoreListItem key={'app-store-' + application.identifier} application={application} />
                    );
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

module.exports = AppStoreList;