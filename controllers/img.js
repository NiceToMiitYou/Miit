
var http = require('http'),
    fs   = require('fs'),
    path = require('path');

function getFromCacheOrUrl(res, filename, link) {

    // Check if we can read the file
    fs.stat(filename, function(err, stats) {       
        if (!err) {
            
            var d = new Date(Date.now() - 24 * 60 * 60 * 1000);

            if(stats.mtime < d) {
                getFromUrl(res, filename, link, function(err) {

                    // Send the local file on error btw
                    sendFile(res, filename);
                });

                return;
            }

            // Send local file
            sendFile(res, filename);

            return;
        }
        
        // Load from the web and handle errors
        getFromUrl(res, filename, link, function(err) {
            fs.unlink(filename);

            return res.status(500).end();
        });
    });
}

function getFromUrl(res, filename, link, cb) {

    var fileStream = fs.createWriteStream(filename);

    // Get the avatar and save it to
    http.get(link, function(response) {

        fileStream.on('finish', function() {
            // On load, save the file
            sendFile(res, filename);
        });

        response.pipe(fileStream);

    }).on('error', function(err) {
        if(err) {
            miitoo.logger.error(err.message);
            miitoo.logger.error(err.stack);
        }

        if(typeof err === 'function') {
            cb(err);
        }
    });
}

function sendFile(res, filename) {

    var file = path.resolve(filename);

    res.sendFile(file, function(err) {
        if (err) {
            miitoo.logger.error(err.message);
            return res.status(err.status).end();
        }
        else
        {
            miitoo.logger.info('Sent:', file);
        }
    });
}

var controller = miitoo.resolve(['MiitConfig', 'ImagesRoutes'], function(config, app) {
    
    // Catch all others request
    app.get(/^\/avatar\/([a-f0-9]{32})$/, function(req, res) {

        var hash = req.params[0] || '',
            file = __dirname + '/../cache/avatar/' + hash,
            link = config.gravatar.replace('{hash}', hash);

        // Handle download
        getFromCacheOrUrl(res, file, link);
    });

    // Catch all others request
    app.get(/^\/([a-f0-9]{24})\/([a-f0-9]{24}).png$/, function(req, res) {

        var parent = req.params[0] || '',
            child  = req.params[1] || '',
            file   = path.resolve(__dirname + '/../cache/team/' + parent + '/' + child);

        res.sendFile(file, function(err) {
            if (err) {
                miitoo.logger.error(err.message);

                return res.status(err.status).end();
            }
            else
            {
                miitoo.logger.info('Sent:', file);
            }
        });
    });
});

miitoo.once('before:start', controller);