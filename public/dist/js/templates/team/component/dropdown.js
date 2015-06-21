var Dropdown = React.createClass({displayName: "Dropdown",
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
            React.createElement("span", {onMouseLeave: this.onLeave, onMouseEnter: this.onEnter, onClick: this.onClick, className: clDropdown}, 
                React.createElement("span", {className: "dropdown-label"}, 
                    this.props.label, 
                    React.createElement("i", {className: clIcon})
                ), 
                
                React.createElement(If, {test: this.state.open}, 
                    React.createElement("div", {className: "dropdown-inner"}, 
                        this.props.children
                    )
                )
            )
        );
    }
});
//# sourceMappingURL=../../team/component/dropdown.js.map