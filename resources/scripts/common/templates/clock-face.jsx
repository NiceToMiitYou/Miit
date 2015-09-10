'use strict';

// Include requirements
var Moment = require('moment');

// Set the locale
Moment.locale('fr');

var ClockFace = React.createClass({
    render: function() {
        var date = Moment(this.props.date);

        // If there is an offset, apply it
        if(global.ServerTimeOffset) {
            date.add(global.ServerTimeOffset, 'milliseconds');
        }

        var value = date.format('LT');

        return (
            <div className="miit-component clock">
                <i className="fa fa-clock-o mr5"></i>
                <span>{value}</span>
            </div>
        );
    }
});

module.exports = ClockFace;