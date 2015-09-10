'use strict';

// Include components
var PageHeader      = require('core/templates/page-header/page-header.jsx');

var DefaultLayout = React.createClass({
    render: function() {
        return (
            <div className="default-layout">
                <PageHeader/>
                {this.props.children}
            </div>
        );
    }
});

module.exports = DefaultLayout;
