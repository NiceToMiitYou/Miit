'use strict';

// Include components
var Clock = require('templates/common/clock.jsx');

var DefaultLayout = React.createClass({
    render: function() {
        return (
            <div className="container-fluid">
                <div className="page-header">
                    <a href="#" className="minimize-menu">
                        <i className="fa fa-bars"></i>
                    </a>
                    <h1>{this.props.title}</h1>
                    <Clock />
                </div>

                {this.props.children}
            </div>
        );
    }
});

module.exports = DefaultLayout;
