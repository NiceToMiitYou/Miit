'use strict';

// Include requirements
var Dispatcher     = require('application/dispatcher'),
    ModalConstants = require('application/constants/modal-constants');

// Shorcut
var ActionTypes = ModalConstants.ActionTypes;

// List of events
var events = KeyMirror({
    // Events on modal open or close
    CLOSE_MODAL: null,
    OPEN_MODAL: null
});

// The ModalStore Object
var ModalStore = ObjectAssign({}, EventEmitter.prototype, {});

// Register Functions based on event
ModalStore.generateNamedFunctions(events.OPEN_MODAL);
ModalStore.generateNamedFunctions(events.CLOSE_MODAL);

// Handle actions
ModalStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.OPEN_MODAL:
            ModalStore.emitOpenModal(action.name, action.element, action.options);
            break;

        case ActionTypes.CLOSE_MODAL:
            ModalStore.emitCloseModal(action.name);
            break;
    }
});

module.exports = ModalStore;