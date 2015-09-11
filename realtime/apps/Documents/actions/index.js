'use strict';

module.exports = function DocumentsActions(app) {

    var DocumentStore = miitoo.get('DocumentStore');
    var UploadStore   = miitoo.get('UploadStore');

    var primus     = miitoo.get('Primus');
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    function sendRefresh(team) {
        primus.in(team.id + ':' + app.identifier()).write({
            event: 'documents:refresh'
        });
    }

    var uploadEvent = 'upload:' + app.identifier();

    // Register the document
    Dispatcher.standalone(uploadEvent, function onUpload(data, team) {
        var upload = data.upload;

        if(!upload || !team) {
            return;
        }

        miitoo.logger.info('File upload to APP_DOCUMENTS.');

        DocumentStore.create(team, upload, function(err) {
            if(err) {
                return;
            }

            sendRefresh(team);
        });
    });

    Dispatcher.load(app.identifier());

    // List documents
    Dispatcher.register('documents:download', 'USER', function onDownloadDocument(spark, data, team, user) {
        var documentId = data.id,
            options    = {};

        if(!documentId) {
            return;
        }

        DocumentStore.findDocument(team, documentId, options, function(err, document) {
            if(err || !document) {
                return;
            }

            var uploadId   = (document.file || {}).id,
                identifier = app.identifier();

            // Allow the download
            UploadStore.allow(uploadId, user, team, identifier, function(err, download) {

                spark.write({
                    event:       'documents:download',
                    application: identifier,
                    download:    download.id,
                    upload:      uploadId
                });
            });
        });
    });

    // List documents
    Dispatcher.register('documents:list', 'USER', function onListDocuments(spark, data, team, user) {
        var options = {};

        DocumentStore.findDocuments(team, options, function(err, documents) {

            spark.write({
                event:     'documents:list',
                documents: documents
            });
        });
    });

    // Remove documents
    Dispatcher.register('documents:remove', 'ADMIN', function onRemoveDocument(spark, data, team) {
        var documentId = data.id;

        if(!documentId) {
            return;
        }

        DocumentStore.remove(team, documentId, function(err) {

            sendRefresh(team);
        });
    });

    Dispatcher.reset();
};