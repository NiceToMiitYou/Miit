(function(){
    var ClockIntervalId;

    MiitComponents.Clock = React.createClass({displayName: "Clock",
        getInitialState: function() {
            return {
                date: new Date()
            };
        },

        componentDidMount: function() {
            this.tick();
            ClockIntervalId = setInterval(function() {
                this.tick();
            }.bind(this), 5000);
        },

        componentWillUnmount: function() {
            clearInterval(ClockIntervalId);
        },

        tick: function() {
            this.setState({
                date: new Date()
            });
        },

        render: function() {
          return (
              React.createElement(ClockFace, {date: this.state.date})
          );
        }
    });
})();
//# sourceMappingURL=../../team/component/clock.js.map