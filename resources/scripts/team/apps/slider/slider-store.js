'use strict';

// Include core requirements
var Dispatcher = MiitApp.require('core/lib/dispatcher');

// Include requirement
var ActionTypes = require('slider-constants').ActionTypes;

// List of events
var events = KeyMirror({
    // Events on quiz event
    PRESENTATIONS_REFRESHED: null,
    SLIDE_CHANGED: null
});

// Global variables
var Presentations = [];

function _refreshPresentations(presentations) {
    Presentations = presentations || [];
}

function _slideChanged(presentationId, current) {
    var presentation = Presentations.findBy('id', presentationId);

    // If presentation exist
    if(presentation) {
        presentation.current = current;

        // Erase the previous save
        Presentations.mergeBy('id', presentation, true);
    }
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
SliderStore.generateNamedFunctions(events.SLIDE_CHANGED);

// Handle actions
SliderStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.REFRESH_PRESENTATIONS:
            _refreshPresentations(action.presentations);
            SliderStore.emitPresentationsRefreshed();
            break;

        case ActionTypes.NEXT_SLIDE:
        case ActionTypes.PREVIOUS_SLIDE:
            _slideChanged(action.presentation, action.current);
            SliderStore.emitSlideChanged(action.presentation, action.current);
            break;
    }
});

module.exports = SliderStore;
