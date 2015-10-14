'use strict';

// Include core requirements
var Dispatcher = MiitApp.require('core/lib/dispatcher');

// Include requirement
var ActionTypes = require('slider-constants').ActionTypes;

// List of events
var events = KeyMirror({
    // Events on quiz event
    PRESENTATIONS_REFRESHED: null
});

// Global variables
var Presentations = [];

function _refreshPresentations(presentations) {
    Presentations = presentations || [];
}

// The SliderStore Object
var SliderStore = ObjectAssign({}, EventEmitter.prototype, {
    getPresentations: function() {
        return Presentations || [];
    },

    getPresentation: function(id) {
        return Presentations.findBy('id', id);
    }
});

// Register Functions based on event
SliderStore.generateNamedFunctions(events.PRESENTATIONS_REFRESHED);

// Handle actions
SliderStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.REFRESH_PRESENTATIONS:
            _refreshPresentations(action.presentations);
            SliderStore.emitPresentationsRefreshed();
            break;
    }
});

module.exports = SliderStore;
