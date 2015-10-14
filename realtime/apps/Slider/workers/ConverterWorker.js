'use strict';

var child_process = require('child_process'),
    path          = require('path'),
    mkdirp        = require('mkdirp');

var waterfall = require('../../../../shared/lib/waterfall.js');

var timeoutId,
    mongoose          = miitoo.get('Mongoose'),
    primus            = miitoo.get('Primus'),
    PresentationStore = miitoo.get('PresentationStore'),
    ObjectId          = mongoose.Types.ObjectId;

function endOfWorker() {
    miitoo.logger.info('End of ConverterWorker.');

    // restart the worker after 5sec
    timeoutId = setTimeout(ConverterWorker, 15000);
}

function ConvertSlide(index, file, target, cb) {
    var cmd = 'convert -alpha opaque -quality 100 -density 240 "' + file + '[' + index + ']" "' + target + '"';

    child_process.exec(cmd, function(err, out) {
        if(err)
        {
            miitoo.logger.error(err.message);
            miitoo.logger.error(err.stack);

            endOfWorker();

            return;
        }

        if(typeof cb === 'function') {
            cb();
        }
    });
}

function CountSlidesOf(file, cb) {
    var cmd = "pdfinfo '" + file + "' | grep Pages: | awk '{print $2}'";

    child_process.exec(cmd, function(err, pages) {
        if(err)
        {
            miitoo.logger.error(err.message);
            miitoo.logger.error(err.stack);

            endOfWorker();

            return;
        }

        if(typeof cb === 'function') {
            cb(+pages || 0);
        }
    });
}

// The worker
function ConverterWorker() {
    miitoo.logger.info('Running ConverterWorker...');

    PresentationStore.findNotConvertedPresentation(function(err, presentation) {
        if(err || !presentation) {
            if(err)
            {
                miitoo.logger.error(err.message);
                miitoo.logger.error(err.stack);
            }
            
            endOfWorker();

            return;
        }

        var file = presentation.file.path;

        CountSlidesOf(file, function(pages) {

            var slides = [],
                folder = path.resolve('./cache/team/' + presentation.id + '/');

            mkdirp(folder, function(err) {
                if(err)
                {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
            
                    endOfWorker();
            
                    return;
                }

                // List all calbacks
                var callbacks = new waterfall(function() {

                    // Add slides to the presentation
                    PresentationStore.addSlides(presentation, slides, function() {
                        
                        endOfWorker();
                    });
                });

                // Create all callbacks
                for(var i = 0; i < pages; i++) {
                    // Create the callback
                    var cb = function(index, next) {
                        // Create a slide
                        var slide = {
                                _id: new ObjectId()
                            },
                            target = folder + '/' + slide._id + '.png';

                        slides.push(slide);

                        ConvertSlide(index, file, target, next);
                    }.bind(null, i);

                    callbacks.push(cb);
                }

                callbacks.run();
            });
        });
    });
}

// Run one time the worker
timeoutId = setTimeout(ConverterWorker, 15000);

// Stop worker before stop
miitoo.once('before:stop', function() {    

    // Stop the worker
    clearTimeout(timeoutId);

    miitoo.logger.info('ConverterWorker Stopped.');
});