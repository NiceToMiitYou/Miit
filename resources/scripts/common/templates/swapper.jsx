var Swapper = React.createClass({
    propTypes: {
        left:    React.PropTypes.node,
        right:   React.PropTypes.node,
        swapped: React.PropTypes.bool
    },

    render: function() {
        var children;

        if (this.props.swapped) {
            children = React.addons.createFragment({
                right: this.props.right,
                left:  this.props.left
            });
        } else {
            children = React.addons.createFragment({
                left:  this.props.left,
                right: this.props.right
            });
        }

        return (
            <div className={this.props.className}>
                {children}
            </div>
        );
    }
});

module.exports = Swapper;