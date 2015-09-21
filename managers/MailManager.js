'use strict';

// Define the manager
var manager = miitoo.resolve(
    ['Mailer', 'MailerConfig', 'ejs'],
    function(Mailer, MailerConfig, ejs) {

    function htmlToText(html) {

        var text = html.toString(); 

        text = text.replace(/<style([\s\S]*?)<\/style>/gi, '');
        text = text.replace(/<script([\s\S]*?)<\/script>/gi, '');
        text = text.replace(/<\/div>/ig, '\n');
        text = text.replace(/<\/li>/ig, '\n');
        text = text.replace(/<li>/ig, '  *  ');
        text = text.replace(/<\/ul>/ig, '\n');
        text = text.replace(/<\/p>/ig, '\n');
        text = text.replace(/<br\s*[\/]?>/gi, '\n');
        text = text.replace(/<[^>]+>/ig, '');
        text = text.replace(/&nbsp;/gi, ' ')
        text = text.replace(/  +/g, ' ');
        text = text.replace(/\n /g, '\n');
        text = text.replace(/\n\n\n+/g, '\n\n');

        return text;
    }

    return {
        sendMail: function(to, title, template, data, locale, callback) {
            if(typeof locale === 'function') {
                callback = locale;
                locale   = undefined;
            }

            if(typeof data === 'function') {
                callback = data;
                data     = undefined;
            }

            data = data || {};

            // Define default value
            data.send_to_email = to;
            data.title         = title;

            // render EJS
            ejs.render(template, data, locale, function(err, html) {
                if(err) {
                    miitoo.logger.error(err);
                }

                // Transform to text
                var text = htmlToText(html);

                // Define mail options
                var mailOptions = {
                    from:    MailerConfig.from,
                    to:      to,
                    subject: ejs.translate(title, locale),
                    html:    html,
                    text:    text
                };

                // Send the mail
                Mailer.sendMail(mailOptions, function(error, message) {
                    if(error) {
                        miitoo.logger.error(error);
                    }

                    miitoo.logger.info('Just send a mail to:', to);

                    if(typeof callback === 'function') {
                        callback(error);
                    }
                });
            });
        }
    };
});

// Register the manager
miitoo.register('MailManager', manager);
