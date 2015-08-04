
var controller = miitoo.resolve(
    ['Lodash', 'MiitConfig', 'ApplicationsConfig', 'MandrillRoutes', 'MailerBackend', 'MailerConfig'],
    function(_, config, applications, app, Mailer, MailerConfig) {
    
    // Catch all others request
    app.all('/webhook', function(req, res) {

        var data = req.body.mandrill_events || false;

        if(!data) {
            return res.end();
        }

        try {
            events = JSON.parse(data);

            events.forEach(function(event) {
                if(event.event !== 'inbound') {
                    return;
                }

                var data = event.msg;

                // Proceed maila
                var receivedBy = data.email;
                var from       = data.from_email;
                var to         = data.to;
                var subject    = data.subject;
                var text       = data.text;

                var message = 'Mail transfered:\n\n';
                
                message += 'Mail received by: ' + receivedBy + '\n';
                message += 'from: ' + from + '\n';
                message += 'to: ' + to + '\n';
                message += 'subject: ' + subject + '\n\n';
                message += 'content:\n\n' + text + '\n\n';
                message += 'End of the transfered email';


                var mailOptions = {
                    from:    MailerConfig.from_backend,
                    to:      MailerConfig.backend_team,
                    subject: 'Mail from Mandrill on miit.fr: ' + subject,
                    text:    message
                };

                Mailer.sendMail(mailOptions, function(error, message) {
                    if(error){
                        miitoo.logger.error(error);
                    }
                });
            });
        } catch(e) {
            miitoo.logger.error(e);
        }

        return res.end();
    });
});

miitoo.once('before:start', controller);