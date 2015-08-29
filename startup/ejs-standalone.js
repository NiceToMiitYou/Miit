// Load ejs
var ejs = require('ejs');

// Define the standalone version
var standalone = miitoo.resolve(['i18n', 'i18nConfig'], function(i18n, config) {

    var instance = {
        translate: function(key, locale) {

            // Set the right locale
            i18n.setLocale(locale || config.defaultLocale);

            return i18n.__(key);
        },

        render: function(filename, data, locale, callback) {
            if(typeof locale === 'function') {
                callback = locale;
                locale   = undefined;
            }

            if(typeof data === 'function') {
                callback = data;
                data     = undefined;
            }

            data = data || {};
            
            // Set the right locale
            i18n.setLocale(locale || config.defaultLocale);

            // Define i18n functions
            data.__  = i18n.__;
            data.__n = i18n.__n;

            // render the file
            return ejs.renderFile(filename, data, callback);
        }
    };

    miitoo.register('ejs', instance, true);
});

miitoo.once('before:start', standalone);