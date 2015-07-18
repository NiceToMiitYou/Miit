
// Include components
var ClockFace = require('./clock-face.jsx');

var Clock = React.createClass({
    IntervalId: null,

    getInitialState: function() {
        return {
            date: new Date()
        };
    },

    componentDidMount: function() {
        this.tick();
        
        this.IntervalId = setInterval(function() {
            this.tick();
        }.bind(this), 5000);
    },

    componentWillUnmount: function() {
        clearInterval(this.IntervalId);
    },

    tick: function() {
        this.setState({
            date: new Date()
        });
    },

    render: function() {
      return (
          <ClockFace date={this.state.date} />
      );
    }
});

module.exports = Clock;