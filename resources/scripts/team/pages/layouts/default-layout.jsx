'use strict';

// Include requirements
var PageActions = require('core/actions/page-actions');

// Include components
var Clock = require('templates/clock.jsx');

var DefaultLayout = React.createClass({
    render: function() {
        return (
            <div className="fullheight">
                <div className="page-header">
                    <a className="minimize-menu" onClick={PageActions.toggleMenu}>
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
