'use strict';

var ProgressBar = React.createClass({
    getDefaultProps: function () {
        return {
            total:   100,
            current: 0,
            unit:    '%',
            color:   'green'
        };
    },

    render: function() {
        var current = this.props.current,
            total   = this.props.total,
            unit    = this.props.unit;

        var percent = Math.round(current / total * 100);

        var style = {
            width: percent + '%'
        };

        var innerClasses = classNames('progress-bar-inner', this.props.color);

        return (
            <div className="miit-component progress-bar">
                <div className="progress-bar-text">{current + this.props.unit}</div>
                <div className={innerClasses} style={style}></div>
            </div>
        );
    }
});

module.exports = ProgressBar;