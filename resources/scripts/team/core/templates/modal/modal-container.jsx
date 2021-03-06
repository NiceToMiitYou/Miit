'use strict';

// Include requirements
var ModalStore = require('core/stores/modal-store');

// Include component
var Modal      = require('./modal.jsx'),
    AlertPopin = require('./alert-popin.jsx');

var ModalContainer = React.createClass({
    getInitialState: function () {
        return {
            modals: []  
        };
    },

    componentDidMount: function() {
        ModalStore.addAlertedListener(this._onAlert);
        ModalStore.addOpenedListener(this._onOpen);
        ModalStore.addClosedListener(this._onClose);
    },

    componentWillUnmount: function() {
        ModalStore.removeAlertedListener(this._onAlert);
        ModalStore.removeOpenedListener(this._onOpen);
        ModalStore.removeClosedListener(this._onClose);
    },

    _onAlert: function(name, options) {
        // Initialize options
        options = options || {};

        var element = (
            <AlertPopin content={options.content} onClick={options.on_click} onAgree={options.on_agree} onCancel={options.on_cancel} />
        );

        this._onOpen(name, element, options);
    },

    _onOpen: function(name, element, options) {
        // Initialize options
        options    = options || {};
        options.id = MiitUtils.generator.guid();

        var modals = this.state.modals;

        // Add the modal in the set
        modals.push({
            name:    name,
            element: element,
            options: options
        });

        // Refresh the container
        this.setState({
            modals: modals
        });
    },

    _onClose: function(name) {
        var modals = this.state.modals;

        // Remove the modal
        modals.removeBy('name', name);

        // Refresh the container
        this.setState({
            modals: modals
        });
    },
    
    render: function() {
        var modals = this.state.modals;

        return (
            <div className="miit-component modal-container-root">
                {modals.map(function(modal) {
                    return (<Modal key={modal.options.id} name={modal.name} element={modal.element} options={modal.options} />);
                })}
            </div>
        );
    }
});

module.exports = ModalContainer;
