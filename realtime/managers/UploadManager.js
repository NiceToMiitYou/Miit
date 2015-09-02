'use strict';

module.exports = function UploadManager() {
    // Get the stores for the upload
    var UploadStore = miitoo.get('UploadStore');
    
    // Get the dispatcher
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    // Handle create an upload request
    Dispatcher.register('upload:create', 'USER', function onUploadCreate(spark, data, team, user) {

        var token       = data.token,
            application = data.application;

        if(!token || !application) {
            return;
        }

        UploadStore.create(team, user, application, function(err, upload) {
            if(err) {
                return;
            }

            spark.write({
                event:       'upload:create',
                upload:      upload.id,
                token:       token,
                application: application
            })
        });
    });
};
