'use strict';

var UploadStore          = require('core/stores/upload-store'),
    NotificationsActions = require('core/actions/notifications-actions');

var text = {
    uploadDone: 'Le fichier a bien été envoyé: '
};

function onFinished(name) {
    NotificationsActions.notify('success', text.uploadDone + name);
}

UploadStore.addFinishedListener(onFinished);