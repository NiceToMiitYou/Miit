'use strict';

// Include components
var ApplicationListHeader = require('./application-list-header.jsx');

var ApplicationList = React.createClass({
    render: function() {
        return (
            <div className="miit-component application-list">
                <ApplicationListHeader />

            </div>
        );
    }
});

module.exports = ApplicationList;