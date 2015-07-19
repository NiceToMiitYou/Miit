'use strict';

// Include requirement
var Router = require('application/router');

// Set the active group global
global.ActiveGroups = {};

var Link = React.createClass({
    onClick: function(e) {
        if(this.props.onLinkClick) {
            this.props.onLinkClick(e);
        }

        if(!this.props.external) {
            // If there is an hystory
            e.preventDefault();

            // Extract the target
            var target = this.props.href || '';
            target     = target.substr(target.indexOf('#') + 1);
            
            // Set the route in the router
            Router.setRoute(target);

            this.setActive();
        }
    },

    setActive: function() {
        if(this.props.activeGroup && this.props.activeName) {
            // Create if not exist
            ActiveGroups[this.props.activeGroup] = this.props.activeName;
        }
    },

    render: function() {
        var className = this.props.className;

        if(this.props.activeGroup && this.props.activeName) {
            // Get the active group
            var activeGroup = this.props.activeGroup;
            var activeName = this.props.activeName;

            // Create if not exist
            if(ActiveGroups[activeGroup] === activeName) {
                className = classNames(className, 'active');
            }
        }

        return (
            <a {...this.props} onClick={this.onClick} className={className}>
                {this.props.children}
            </a>
        );
    }
});

module.exports = Link;