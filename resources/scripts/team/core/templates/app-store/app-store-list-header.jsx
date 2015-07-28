'use strict';

var AppStoreListHeader = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                title:   'Application'
            }
        };
    },
    render: function() {
        return (
            <div className="miit-component app-store-list-header">
                <span>
                    {this.props.text.title}
                </span>
            </div>
        );
    }
});

module.exports = AppStoreListHeader;