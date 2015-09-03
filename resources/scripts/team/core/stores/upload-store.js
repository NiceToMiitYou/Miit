'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    ActionTypes = require('core/constants/upload-constants').ActionTypes;

// List of events
var events = KeyMirror({
    CREATED: null,
    NEW: null,
    PROGRESS: null,
    FINISHED: null
});

var Uploads = [];

function _addUpload(uploadId, name, application) {
    var upload = {
        id:          uploadId,
        current:     0,
        total:       0,
        name:        name,
        application: application
    };

    Uploads.addBy('id', upload);
}

function _updateUpload(uploadId, current, total) {
    var previous = Uploads.findBy('id', uploadId);

    if(!previous) {
        return;
    }

    var upload = {
        id:          uploadId,
        current:     current,
        total:       total,
        name:        previous.name,
        application: previous.application
    };

    Uploads.mergeBy('id', upload, true);
}

function _removeUpload(uploadId) {
    Uploads.removeBy('id', uploadId);
}

// The UploadStore Object
var UploadStore = ObjectAssign({}, EventEmitter.prototype, {
    getProgress: function(id) {
        var upload = Uploads.findBy('id', id);

        if(upload) {
            return Math.round(upload.current / (upload.total + 1) * 100);
        }

        return 0;
    },

    getUploads: function() {
        return Uploads;
    },

    getUploadsByApplication: function(application) {
        return Uploads.filter(function(upload) {
            return application === upload.application;
        });
    }
});

// Register Functions based on event
UploadStore.generateNamedFunctions(events.CREATED);
UploadStore.generateNamedFunctions(events.NEW);
UploadStore.generateNamedFunctions(events.PROGRESS);
UploadStore.generateNamedFunctions(events.FINISHED);

// Handle actions
UploadStore.dispatchToken = Dispatcher.register(function(action){
    switch(action.type) {
        case ActionTypes.CREATE_UPLOAD:
            UploadStore.emitCreated(action.token, action.upload);
            break;

        case ActionTypes.NEW_UPLOAD:
            _addUpload(action.id, action.name, action.application);
            UploadStore.emitNew();
            break;

        case ActionTypes.PROGRESS_UPLOAD:
            _updateUpload(action.id, action.current, action.total);
            UploadStore.emitProgress(action.id);
            break;

        case ActionTypes.DONE_UPLOAD:
            _removeUpload(action.id);
            UploadStore.emitFinished();
            break;
    }
});

module.exports = UploadStore;