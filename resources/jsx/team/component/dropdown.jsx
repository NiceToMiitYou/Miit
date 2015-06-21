var Dropdown = React.createClass({
    timeoutId: null,

    propTypes: {
        label: React.PropTypes.string.isRequired
    },

    getDefaultProps: function() {
        return {
            angle: 'down'
        };
    },

    getInitialState: function () {
        return {
            open: false
        };
    },

    toggleAngle: function() {
        var angle = this.props.angle;
        if(this.state.open) {
            return (angle === 'up') ? 'down': 'up';
        }
        return angle;
    },

    _onLeave: function() {
        if(this.isMounted()) {
            this.setState({
                open: false
            });
        }
    },

    onLeave: function() {
        this.timeoutId = setTimeout(this._onLeave, 675);
    },

    onEnter: function() {
        clearTimeout(this.timeoutId);
    },

    onClick: function() {
        this.onEnter();
        this.setState({
            open: !this.state.open
        });
    },

    render: function() {
        var icon = 'fa-angle-' + this.toggleAngle();
        var open = { open: this.state.open };

        var clIcon     = classNames('pull-right', 'fa', icon);
        var clDropdown = classNames('miit-component', 'dropdown', open);

        return (
            <span onMouseLeave={this.onLeave} onMouseEnter={this.onEnter} onClick={this.onClick} className={clDropdown}>
                <span className="dropdown-label">
                    {this.props.label}
                    <i className={clIcon}></i>
                </span>
                
                <If test={this.state.open}>
                    <div className="dropdown-inner">
                        {this.props.children}
                    </div>
                </If>
            </span>
        );
    }
});