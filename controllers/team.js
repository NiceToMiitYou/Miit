var fs         = require('fs');
var path       = require('path');
var mkdirp     = require('mkdirp');
var multiparty = require('multiparty');

function waterfall(cb) {
    // the last call back and the list of callbacks
    var last      = cb,
        callbacks = [];

    // Call the next callback
    function nextCallback() {
        var func = callbacks.shift();

        if(typeof func === 'function') {

            func.call({}, nextCallback);
        }
    }

    this.push = callbacks.push;
    this.run  = function() {
        // Add the last callback
        callbacks.push(last);

        // Run the first one
        nextCallback();
    };
}

function removeFiles(files, cb) {
    if(!files) {
        return;
    }

    var callbacks = new waterfall(cb);

    // Delete each files
    for(var file in files) {
        var tmp_path = files[file][0].path;

        callbacks.push(function(next) {

            // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
            fs.unlink(tmp_path, function(err) {
                if (err) {
                    miitoo.logger.error(err.message);
                    miitoo.logger.error(err.stack);
                }

                next();
            });
        });
    }

    // Call the first callback
    callbacks.run();
}

function generateTarget(base, teamId) {
    var target = base + '/' + teamId;

    // Loop for password length
    for(var i = 0; i <= 4; i++) {
        // Add separator each 3 loop
        if(0 === i % 2) {
            target += '/';
        }

        target += Math.random().toString(36).slice(-8);
    }

    target = path.resolve(target);

    return {
        fullpath: target,
        folder:   target.substring(0, target.lastIndexOf('/'))
    };
}

function handleEnd(res, files, err) {
    if(err) {
        miitoo.logger.error(err.message);
        miitoo.logger.error(err.stack);
    }

    // Remove files
    removeFiles(files, function() {

        return res.end();
    });
}

function handleErr(res, err) {
    if(err) {
        miitoo.logger.error(err.message);
        miitoo.logger.error(err.stack);
    }

    return res.end();
}

var controller = miitoo.resolve(
    ['Jwt', 'MiitConfig', 'ApplicationsConfig', 'TeamRoutes', 'TeamStore', 'UploadStore', 'RealtimeDispatcher'],
    function(jwt, config, applications, app, TeamStore, UploadStore, RealtimeDispatcher) {
    
    // Find the team and allow the user if exist
    app.use(function(req, res, next) {
        var slug = (req.subdomains || [])[0];

        // If no subdomain redirect to home
        if(typeof slug === 'undefined' || slug.length < 4) {
            var port = (config.domain === 'miit.fr') ? '' : ':' + config.port;
            var url  = 'http://www.' + config.domain + port + '/';

            return res.redirect(301, url);
        }

        // Or find if a team exist
        TeamStore.findTeamBySlug(slug, function(err, team) {
            if(err) {
                miitoo.logger.error(err.message);
                miitoo.logger.error(err.stack);
            }
            
            if(!team) {
                var scheme = (config.domain === 'miit.fr') ? 'https://' : 'http://';
                var port   = (config.domain === 'miit.fr') ? '' : ':' + config.port;
                var url    = scheme + 'www.' + config.domain + port + '/';

                return res.redirect(url);
            }

            // Define values for the request
            req.team = team;

            next();
        });
    });

    // Handle download of files
    app.post('/download', function(req, res) {

        if(
            !req.body ||
            !req.body.upload      || typeof req.body.upload      !== 'string' ||
            !req.body.application || typeof req.body.application !== 'string' ||
            !req.body.token       || typeof req.body.token       !== 'string' || 'null' === req.body.token
        ) {
            return res.end();
        }

        // Prepare variables
        var application = req.body.application,
            uploadId    = req.body.upload,
            token       = req.body.token,
            team        = req.team;
        
        // Check the token
        jwt.verify(token, function(err, payload) {
            if(err || !payload)
            {
                return handleErr(res, err);
            }

            var userId = payload.user;

            // Find the original file instruction
            UploadStore.getUploaded(uploadId, team, userId, application, function(err, upload) {
                if(err || !upload)
                {
                    return handleErr(res, err);
                }

                // Save informations
                UploadStore.incrementDownloads(upload, function(err) {
                    if(err)
                    {
                        return handleErr(res, err);
                    }

                    return res.download(upload.path, upload.name, function(err){
                        if(err) {
                            miitoo.logger.error(err.message);
                            miitoo.logger.error(err.stack);
                        }
                    });
                });
            });
        });
    });

    // Handle upload of files
    app.post('/upload', function(req, res) {

        // Create a form
        var form = new multiparty.Form({
            autoFields: true,
            autoFiles:  true
        });

        // Load primus
        var primus = miitoo.get('Primus');

        // Initialize variables
        var userId, uploadId, lastProgress, team = req.team;

        // Handle progress
        form.on('field', function(name, value) {
            if('token' === name) {
                // Check the token
                jwt.verify(value, function(err, payload) {
                    if(err || !payload)
                    {
                        return;
                    }

                    userId = payload.user || null;
                });
            } else if('upload' === name) {
                uploadId = value || null;
            }
        });

        // Handle progress
        form.on('progress', function(bytesReceived, bytesExpected) {
            // Calculate progress to send update at each percent
            var progress = Math.round(bytesReceived / ( bytesExpected + 1 ) * 100);
            
            // Check to send data to client
            if(primus && team.id && userId && uploadId && lastProgress !== progress) {
                // Send informations
                primus.in(team.id + ':' + userId).write({
                    event:   'upload:progress',
                    upload:  uploadId,
                    current: bytesReceived,
                    total:   bytesExpected
                });

                // Update last progress
                lastProgress = progress;
            }
        });

        // Parse the request
        form.parse(req, function(err, fields, files) {
            if(
                !fields || !files || err || !files.document || !files.document[0] ||
                !fields.upload      || typeof fields.upload[0]      !== 'string' ||
                !fields.application || typeof fields.application[0] !== 'string' ||
                !fields.token       || typeof fields.token[0]       !== 'string' || 'null' === fields.token[0]
            ) {
                // Remove files
                return handleEnd(res, files);
            }

            // Prepare variables
            var application = fields.application[0],
                uploadId    = fields.upload[0],
                token       = fields.token[0],
                document    = files.document[0];
            
            // Check the token
            jwt.verify(token, function(err, payload) {
                if(err || !payload)
                {
                    return handleEnd(res, files, err);
                }

                var userId = payload.user;

                // Find the original file instruction
                UploadStore.getNotUploaded(uploadId, team, userId, application, function(err, upload) {
                    if(err || !upload)
                    {
                        return handleEnd(res, files, err);
                    }

                    // Generate target path and extract information
                    var target = generateTarget(config.upload, team.id),
                        name   = document.originalFilename,
                        size   = document.size,
                        type   = document.headers['content-type'] || null;

                    // Save informations
                    UploadStore.setUploaded(upload, target.fullpath, name, size, type, function(err) {
                        if(err)
                        {
                            return handleEnd(res, files, err);
                        }

                        // Create patg where upload
                        mkdirp(target.folder, function(err) {
                            if(err)
                            {
                                return handleEnd(res, files, err);
                            }

                            // move the file from the temporary location to the intended location
                            fs.rename(document.path, target.fullpath, function(err) {
                            
                                miitoo.logger.info('File uploaded to:', target.fullpath, '-', size, 'bytes');

                                // Send the event to the applications
                                RealtimeDispatcher.play('upload:' + application, team, {
                                    upload: upload,
                                    user:   userId
                                });
            
                                // Check to send data to client
                                if(primus && team.id && userId && uploadId) {
                                    // Send informations
                                    primus.in(team.id + ':' + userId).write({
                                        event:  'upload:done',
                                        upload: uploadId
                                    });
                                }

                                return handleEnd(res, files, err);
                            });
                        });
                    });
                });
            });
        });
    });

    // Catch all others request
    app.all('*', function(req, res) {

        return res.render('team/index', {
            team: req.team,
            apps: applications
        });
    });
});

miitoo.once('before:start', controller);