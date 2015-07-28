'use strict';

// Include requirements
var ModalStore = require('application/stores/modal-store');

// Include component
var Modal = require('./modal.jsx');

var ModalContainer = React.createClass({
    getInitialState: function () {
        return {
            modals: []  
        };
    },

    componentDidMount: function() {
        ModalStore.addOpenModalListener(this._onOpen);
        ModalStore.addCloseModalListener(this._onClose);
    },

    componentWillUnmount: function() {
        ModalStore.removeOpenModalListener(this._onOpen);
        ModalStore.removeCloseModalListener(this._onClose);
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
