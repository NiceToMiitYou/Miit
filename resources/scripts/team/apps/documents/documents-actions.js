'use strict';

// Include core requirements
var Dispatcher = MiitApp.require('core/lib/dispatcher'),
    Realtime   = MiitApp.require('core/lib/realtime'),
    UserStore  = MiitApp.require('core/stores/user-store');

// Include requirements
var ActionTypes = require('documents-constants').ActionTypes;

//
// Listen for events
//

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