(function(){
    MiitComponents.Loading = React.createClass({displayName: "Loading",

        getDefaultProps: function() {
            return {
                loading: 'Chargement...'
            };
        },

        render: function() {
          return (
              React.createElement("div", {className: "miit-component loading-container"}, 
                  React.createElement("div", {className: "loading"}, 
                      React.createElement("img", {src: "/img/logo-miit-outter.png"}), 
                      React.createElement("img", {className: "inner", src: "/img/logo-miit-inner.png"})
                  ), 
                  this.props.loading
              )
          );
        }
    });
})();
//# sourceMappingURL=../../team/component/loading.js.map