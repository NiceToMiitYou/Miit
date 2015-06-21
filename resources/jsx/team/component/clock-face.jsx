var ClockFace = React.createClass({
    render: function() {
        var d = this.props.date;
        var prefix  = d.getMinutes() < 10 ? '0' :'';
        var minutes = prefix + d.getMinutes();
        var hours   = d.getHours();

        return (
          <div className="miit-component clock">
              <i className="fa fa-clock-o pull-left"></i>
              <span>{hours}:</span>
              <span>{minutes}</span>
          </div>
        );
    }
});