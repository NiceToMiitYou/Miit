'use strict';

var Panel = React.createClass({
    getDefaultProps: function() {
        return {
            icon:  'info',
            title: ''
        };
    },

    render: function() {
      var titleClasses = classNames('pull-left', 'fa', 'fa-' + this.props.icon);
      
      return (
          <div className="miit-component panel mt30" >
              <h2 className="panel-title"><i className={titleClasses}></i>{this.props.title}</h2>
              <div className="panel-content">
                  {this.props.children}
              </div>
          </div>
      );
    }
});

module.exports = Panel;