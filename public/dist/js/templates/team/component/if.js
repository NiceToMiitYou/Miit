var If = React.createClass({displayName: "If",
    render: function() {
        if (this.props.test) {
            return this.props.children;
        } else {
            return null;
        }
    }
});
//# sourceMappingURL=../../team/component/if.js.map