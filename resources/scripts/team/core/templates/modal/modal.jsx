'use strict';

// Include requierments
var ModalActions = require('core/actions/modal-actions');

// Include common
var If = require('templates/if.jsx');

var Modal = React.createClass({
    getDefaultProps: function () {
        return {
            name:   'Modal',
            element: null,
            options: {

            }
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
        var overlay = false !== this.props.options.overlay,
            title   = this.props.options.title || this.props.name;

        var colorClass = '';

        switch(this.props.options.color) {
            case 'dark' :
                colorClass = 'bg-blue-grey text-white';
                break;

            case 'grey' :
                colorClass = 'bg-grey';
                break;

            default : 
                colorClass =  'bg-grey lighten-5';
                break;
        }

        var modalClasses = classNames('modal-dialog', colorClass, this.props.options.size || 'medium')

        return (
            <div className="miit-component modal-container">
                <If test={overlay}>
                    <div className="modal-overlay" onClick={this.handleOverlayClick}></div>
                </If>
                <div className={modalClasses}>
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
