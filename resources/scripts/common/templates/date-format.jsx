'use strict';

// Include requirements
var Moment = require('moment');

// Set the locale
Moment.locale('fr');

var DateFormat = React.createClass({
    getDefaultProps: function () {
        return {
            date:   new Date(),
            format: 'llll',
            from:   false
        };
    },

    formatDate: function() {
        // Initialize variables
        var date = Moment(this.props.date);

        // If there is an offset, apply it
        if(global.ServerTimeOffset) {
            date.add(global.ServerTimeOffset, 'milliseconds');
        }

        // Display from now
        if(true === this.props.from) {
            return date.fromNow();
        }

        return date.format(this.props.format);
    },

    render: function() {
        var date = this.formatDate();

        return (
            <span className="miit-component date-format">
                {date}
            </span>
        );
    }
});

module.exports = DateFormat;