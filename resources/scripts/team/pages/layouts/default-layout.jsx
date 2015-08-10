'use strict';

// Include requirements
var PageActions = require('core/actions/page-actions');

// Include components
var Clock = require('templates/clock.jsx');

var DefaultLayout = React.createClass({
    getDefaultProps: function () {
        return {
            fullheight: false  
        };
    },

    render: function() {
        var classes = classNames((this.props.fullheight) ? 'fullheight' : '');

        return (
            <div className={classes}>
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
