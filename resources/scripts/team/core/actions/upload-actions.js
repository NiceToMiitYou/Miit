'use strict';

// Include requirements
var Dispatcher  = require('core/lib/dispatcher'),
    Realtime    = require('core/lib/realtime'),
    ActionTypes = require('core/constants/upload-constants').ActionTypes,
    UserStore   = require('core/stores/user-store');


// Add a field to the form
function addField(form, name, value) {
    var el = form.querySelector('input[name="' + name + '"]');

    if(!el) {
        // If the element doesn't exist, create it
        el = document.createElement('input');

        el.setAttribute('type', 'hidden');
        el.setAttribute('name',  name);
    }

    el.setAttribute('value', value);

    form.insertBefore(el, form.firstChild);
}

function randomString() {
    var str = '';

    for(var i = 0; i < 3; i++) {
        str += Math.random().toString(36).slice(-8);
    }

    return str;
}

function createIframe(action, application, upload) {
    // Define the id
    var id = action + '-iframe-' + application + '-' + upload + '-' + randomString();
    
    // Define the element
    var ifr = document.createElement('iframe');
    
    ifr.setAttribute('id',   id);
    ifr.setAttribute('name', id);

    // Add the iframe to the dummy-zone
    document.getElementById('dummy-zone').appendChild(ifr);

    // on load, remove the iframe
    ifr.onload = function() {
        ifr.parentNode.removeChild(ifr);
    };

    // Only need the id
    return id;
}

Realtime.on('upload:create', function(data) {
    if(!data.token || !data.upload) {
        return;
    }

    var action = {
        type:   ActionTypes.CREATE_UPLOAD,
        upload: data.upload,
        token:  data.token
    };

    Dispatcher.dispatch(action);
});

Realtime.on('upload:progress', function(data) {
    if(!data.upload) {
        return;
    }

    var action = {
        type:    ActionTypes.PROGRESS_UPLOAD,
        id:      data.upload,
        current: data.current,
        total:   data.total
    };

    Dispatcher.dispatch(action);
});

Realtime.on('upload:done', function(data) {
    if(!data.upload) {
        return;
    }

    var action = {
        type: ActionTypes.DONE_UPLOAD,
        id:   data.upload
    };

    Dispatcher.dispatch(action);
});

// Expose the actions
module.exports = {
    upload: function(form, application, upload) {
        if(!UserStore.isAdmin() || !form) {
            return false;
        }

        // Find the input
        var input = form.querySelector('input[type=file]');

        if(!input) {
            return false;
        }

        // Number of files
        var files = input.files.length;

        if(0 === files) {
            return false;
        }

        var fileName = input.files[0].name;

        // Add a hidden field before upload
        addField(form, 'application', application);
        addField(form, 'upload',      upload);
        addField(form, 'token',       UserStore.getToken());

        // If no error, submit the form in the iframe
        form.target = createIframe('upload', application, upload);
        form.submit();

        // Register the upload
        var action = {
            type:        ActionTypes.NEW_UPLOAD,
            id:          upload,
            name:        fileName,
            application: application
        };

        setTimeout(Dispatcher.dispatch.bind(Dispatcher, action));

        return true;
    },

    download: function(application, download, upload) {
        if(!UserStore.isUser() || !application || !download || !upload) {
            return false;
        }

        // Create the form
        var form = document.createElement('form');
        
        form.setAttribute('method', 'POST');
        form.setAttribute('action', '/download');
        form.setAttribute('enctype', 'application/x-www-form-urlencoded');

        // Add a hidden field before download
        addField(form, 'application', application);
        addField(form, 'download',    download);
        addField(form, 'upload',      upload);
        addField(form, 'token',       UserStore.getToken());

        // Create an iframe download
        form.target = createIframe('download', application, upload);
        form.submit();

        return true;
    },

    create: function(application) {
        var token = randomString();

        Realtime.send('upload:create', {
            token:       token,
            application: application
        });

        return token;
    }
};
