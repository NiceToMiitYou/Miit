'use strict';

// Include requirements
var PageActions = require('core/actions/page-actions');
var PageStore = require('core/stores/page-store');

// Include common
var If   = require('templates/if.jsx');

// Include components
var Link                = require('core/templates/components/link.jsx'),
    RightMenuHeaderItem = require('./right-menu-header-item.jsx');

var RightMenuHeader = React.createClass({
    getDefaultProps: function () {
        return {
            text: {

            },

            tabs: []
        };
    },

    render: function() {

        var icon = classNames('fa', this.props.icon, 'mr5');
        var tabs = this.props.tabs;
        var className = classNames((true === PageStore.getRightMenuLockState()) ? 'active' : '', 'sr-pin');

        return (
        	<div className="sr-header miit-component">
                <ul>
                    <li className={className} onClick={PageActions.toggleRightMenuLock}><i className="fa fa-thumb-tack"></i></li>
                    {tabs.map(function(tab) {
                        var isCurrent = tab.id === this.props.current;

                        return (
                            <RightMenuHeaderItem key={tab.id} tab={tab} active={isCurrent} setCurrent={this.props.setCurrent} />
                        );
                    }, this)}
                </ul>
            </div>
        );
    }
});

module.exports = RightMenuHeader;