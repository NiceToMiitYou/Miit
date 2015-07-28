'use strict';

// Include requierments
var ModalActions = require('application/actions/modal-actions');

// Include common
var If = require('templates/common/if.jsx');

var Modal = React.createClass({
    getDefaultProps: function () {
        return {
            name:   'Modal',
            element: null,
            options: {}
        };
    },

    handleOverlayClick: function() {
        if(false === this.props.options.overlay_closeable) {
            return;
        }

        // Close the modal
        ModalActions.close(this.props.name);
    },

    render: function() {
        var overlay = false !== this.props.options.overlay;
        var title = this.props.options.title || this.props.name;

        return (
            <div className="miit-component modal-container">
                <If test={overlay}>
                    <div className="modal-overlay" onClick={this.handleOverlayClick}></div>
                </If>
                <div className="modal-dialog">
                    <div className="modal-title">{title}</div>
                    <div className="modal-content">
                        {this.props.element}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Modal;
