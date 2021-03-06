'use strict';

var MenuLabel = React.createClass({
    render: function() {
        var classes = classNames('fa', this.props.icon || '');
        
        return (
            <span className="miit-component menu-label sl-label">
                <i className={classes}></i>
                {this.props.label}
            </span>
        );
    }
});

module.exports = MenuLabel;