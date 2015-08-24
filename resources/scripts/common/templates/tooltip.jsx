'use strict';

// Include components
var If = require('./if.jsx');

var OverlayTrigger = React.createClass({
    timeoutId: null,

    propTypes: {
        label:     React.PropTypes.string,
        className: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {

        };
    },

    getInitialState: function () {
        return {
            open: false,
            closing: false
        };
    },

    _onLeave: function() {
        if(this.isMounted()) {
            this.setState({
                open: false,
                closing: false
            });
        }
    },

    onLeave: function() {
        this.timeoutId = setTimeout(this._onLeave, 550);
        this.setState({
            closing: true
        });
    },

    onEnter: function() {
        clearTimeout(this.timeoutId);
        this.setState({
            open: true,
                closing: false
        });
    },

    render: function() {
        var open = { open: this.state.open };
        var closing = { closing: this.state.closing };
        var clOverlay = classNames(open, this.props.className, closing, "tooltip-overlay");

        var style = {
        	width: this.props.width
        }
        return (
            <span onMouseLeave={this.onLeave} onMouseEnter={this.onEnter} className={clOverlay}>
                {this.props.children}
                <If test={this.state.open}>
                	<div className="tooltip" style={style}>
                    	{this.props.content}
                    </div>
                </If>
            </span>
        );
    }
});

module.exports = OverlayTrigger;