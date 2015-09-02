'use strict';

module.exports = function DocumentsActions(app) {

    var DocumentStore = miitoo.get('DocumentStore');

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

    // List documents
    Dispatcher.register('documents:list', 'USER', app.identifier(), function onListDocuments(spark, data, team, user) {
        var options = {};

        // Retreive quizzes based on options
        DocumentStore.findDocuments(team, options, function(err, documents) {

            spark.write({
                event:     'documents:list',
                documents: documents
            });
        });
    });

    // Remove documents
    Dispatcher.register('documents:remove', 'ADMIN', app.identifier(), function onRemoveDocument(spark, data, team) {
        var documentId = data.id;

        if(!documentId) {
            return;
        }

        // Retreive quizzes based on options
        DocumentStore.remove(team, documentId, function(err) {

            sendRefresh(team);
        });
    });
};