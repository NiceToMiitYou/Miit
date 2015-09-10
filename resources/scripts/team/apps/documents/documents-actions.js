'use strict';

// Include core requirements
var Dispatcher    = MiitApp.require('core/lib/dispatcher'),
    Realtime      = MiitApp.require('core/lib/realtime'),
    UserStore     = MiitApp.require('core/stores/user-store'),
    UploadActions = MiitApp.require('core/actions/upload-actions');

// Include requirements
var ActionTypes = require('documents-constants').ActionTypes;

//
// Listen for events
//

Realtime.on('documents:download', function(data) {
    if(!data.application || !data.upload || !data.download) {
        return;
    }

    UploadActions.download(
        data.application,
        data.download,
        data.upload
    );
});

Realtime.on('documents:list', function(data) {
    var action = {
        type:      ActionTypes.REFRESH_DOCUMENTS,
        documents: data.documents
    };

    // Dispatch the action
    Dispatcher.dispatch(action);
});

// Debounces documents refresh to avoid flood
var refreshDocuments = Debounce(function() {
    Realtime.send('documents:list');
}, 250);

Realtime.on('documents:refresh', refreshDocuments);

// Expose the actions
module.exports = {
    download: function(id) {
        if(!id) {
            return;
        }

        Realtime.send('documents:download', {
            id: id
        });
    },

    remove: function(id) {
        if(!UserStore.isAdmin() || !id) {
            return;
        }

        Realtime.send('documents:remove', {
            id: id
        });
    },

    refresh: function() {
        refreshDocuments();
    }
};