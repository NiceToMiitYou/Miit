'use strict';

var Loading = React.createClass({
    getDefaultProps: function() {
        return {
            loading: 'Chargement...'
        };
    },

    render: function() {
      return (
          <div className="miit-component loading-container">
              <div className="loading">
                  <img src="/img/logo-miit-black-outter.png" alt="" />
                  <img src="/img/logo-miit-black-inner.png"  alt="" className="inner"/>
              </div>
              {this.props.loading}
          </div>
      );
    }
});

module.exports = Loading;