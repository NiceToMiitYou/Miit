'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    ActionTypes = require('core/constants/modal-constants').ActionTypes;

// List of events
var events = KeyMirror({
    // Events on modal open or close
    ALERTED: null,
    CLOSED: null,
    OPENED: null
});

// The ModalStore Object
var ModalStore = ObjectAssign({}, EventEmitter.prototype, {});

// Register Functions based on event
ModalStore.generateNamedFunctions(events.ALERTED);
ModalStore.generateNamedFunctions(events.OPENED);
ModalStore.generateNamedFunctions(events.CLOSED);

// Handle actions
ModalStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.ALERT_MODAL:
            ModalStore.emitAlerted(action.name, action.options);
            break;

        case ActionTypes.OPEN_MODAL:
            ModalStore.emitOpened(action.name, action.element, action.options);
            break;

        case ActionTypes.CLOSE_MODAL:
            ModalStore.emitClosed(action.name);
            break;
    }
});

module.exports = ModalStore;