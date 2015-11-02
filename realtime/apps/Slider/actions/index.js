'use strict';

module.exports = function SliderActions(app) {

    var PresentationStore = miitoo.get('PresentationStore');
    var UploadStore       = miitoo.get('UploadStore');

    var primus     = miitoo.get('Primus');
    var Dispatcher = miitoo.get('RealtimeDispatcher');

    function sendRefresh(team) {
        primus.in(team.id + ':' + app.identifier()).write({
            event: 'slider:refresh'
        });
    }

    var uploadEvent = 'upload:' + app.identifier();

    // Register the document
    Dispatcher.standalone(uploadEvent, function onUpload(data, team) {
        var upload = data.upload;

        if(!upload || !team) {
            return;
        }

        miitoo.logger.info('File upload to APP_SLIDER.');

        // Accept only PDF
        if('application/pdf' !== upload.type) {
            UploadStore.setRemoved(upload);
            return;
        }

        PresentationStore.create(team, upload, function(err) {
            if(err) {
                return;
            }

            sendRefresh(team);
        });
    });

    function optionsPresentation(team, roles) {
        // Check for roles
        var isAdmin = -1 !== roles.indexOf('ADMIN');
        var isUser  = -1 !== roles.indexOf('USER');

        return {
            // Display private if admin or if user and team public
            private:     isAdmin || team.public && isUser,
            
            // Display unpublished, closed if admin
            unpublished: isAdmin,
            closed:      isAdmin,
            converted:   isAdmin
        };
    }

    Dispatcher.load(app.identifier(), {
        writes: [
            // 'documents:remove'
        ]
    });

    // List presentations
    Dispatcher.register('slider:presentations', 'USER', function onListPresentations(spark, data, team, user, roles) {

        // Get options
        var options = optionsPresentation(team, roles);

        // Retreive presentations based on options
        PresentationStore.findPresentations(team, options, function(err, presentations) {

            spark.write({
                event:         'slider:presentations',
                presentations: presentations
            });
        });
    });

    // Publish a presentation
    Dispatcher.register('slider:publish', 'ADMIN', function onPubishPresentation(spark, data, team, user) {
        var presentationId = data.id;

        if(!presentationId) {
            return;
        }

        PresentationStore.publish(presentationId, team, function(err, slider) {
            sendRefresh(team);
        });
    });

    // Close a presentation
    Dispatcher.register('slider:close', 'ADMIN', function onClosePresentation(spark, data, team, user) {
        var presentationId = data.id;

        if(!presentationId) {
            return;
        }

        PresentationStore.close(presentationId, team, function(err, slider) {
            sendRefresh(team);
        });
    });

    // Reopen a presentation
    Dispatcher.register('slider:reopen', 'ADMIN', function onReopenPresentation(spark, data, team, user) {
        var presentationId = data.id;

        if(!presentationId) {
            return;
        }

        PresentationStore.reopen(presentationId, team, function(err, slider) {
            sendRefresh(team);
        });
    });

    // Reopen a presentation
    Dispatcher.register('slider:next', 'ADMIN', function onNextSlidePresentation(spark, data, team, user) {
        var presentationId = data.id;

        if(!presentationId) {
            return;
        }

        PresentationStore.next(presentationId, team, function(err, slider) {
            if(!slider) {
                return;
            }
            
            primus.in(team.id + ':' + app.identifier()).write({
                event:        'slider:next',
                presentation: presentationId,
                current:      slider.current
            });
        });
    });

    // Reopen a presentation
    Dispatcher.register('slider:previous', 'ADMIN', function onPreviousSlidePresentation(spark, data, team, user) {
        var presentationId = data.id;

        if(!presentationId) {
            return;
        }

        PresentationStore.previous(presentationId, team, function(err, slider) {
            if(!slider) {
                return;
            }

            primus.in(team.id + ':' + app.identifier()).write({
                event:        'slider:previous',
                presentation: presentationId,
                current:      slider.current
            });
        });
    });

    // Update a presentation
    Dispatcher.register('quiz:update', 'ADMIN', function onUpdatePresentation(spark, data, team, user) {
        var presentationId = data.id,
            name           = data.name || '',
            description    = data.description || '';

        if(
            !presentationId ||
            'string' !== typeof name ||
            'string' !== typeof description ||
            !name || !name.trim()
        ) {
            return;
        }

        name        = name.trim();
        description = description.trim();

        PresentationStore.update(presentationId, name, description, team, function(err, quiz) {
            sendRefresh(team);
        });
    });

    Dispatcher.reset();
};