'use strict';

// Include core requirements
var Dispatcher = MiitApp.require('core/lib/dispatcher');

// Include requirement
var ActionTypes = require('documents-constants').ActionTypes;

// List of events
var events = KeyMirror({
    // Events on document event
    DOCUMENTS_REFRESHED: null
});

// Global variables
var Documents;

function _refreshDocuments(documents) {
    Documents = documents || [];    
}

// The DocumentsStore Object
var DocumentsStore = ObjectAssign({}, EventEmitter.prototype, {
    getDocument: function(id) {
        return this.getDocuments().findBy('id', id);
    },

    getDocuments: function() {
        return Documents || [];
    }
});

// Register Functions based on event
DocumentsStore.generateNamedFunctions(events.DOCUMENTS_REFRESHED);

// Handle actions
DocumentsStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.REFRESH_DOCUMENTS:
            _refreshDocuments(action.documents);
            DocumentsStore.emitDocumentsRefreshed();
            break;
    }
});

module.exports = DocumentsStore;
