var ClockFace = React.createClass({displayName: "ClockFace",
    render: function() {
        var d = this.props.date;
        var prefix  = d.getMinutes() < 10 ? '0' :'';
        var minutes = prefix + d.getMinutes();
        var hours   = d.getHours();

        return (
          React.createElement("div", {className: "miit-component clock"}, 
              React.createElement("i", {className: "fa fa-clock-o pull-left"}), 
              React.createElement("span", null, hours, ":"), 
              React.createElement("span", null, minutes)
          )
        );
    }
});
//# sourceMappingURL=../../team/component/clock-face.js.map