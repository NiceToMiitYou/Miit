'use strict';

var ApplicationListHeader = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                title:   'Nom de l\'application',
                actions: 'Actions'
            }
        };
    },
    render: function() {
        return (
            <div className="miit-component application-list-header">
                <span>
                    {this.props.text.title}
                </span>
                <span>
                    {this.props.text.actions}
                </span>
            </div>
        );
    }
});

module.exports = ApplicationListHeader;