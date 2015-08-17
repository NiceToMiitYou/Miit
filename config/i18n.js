'use strict';

var config = {
    // setup some locales - other locales default to en silently
    locales: ['fr', 'en'],
 
    // you may alter a site wide default locale
    defaultLocale: 'fr',

    // where to store json files - defaults to './locales' relative to modules directory
    directory: __dirname + '/../locales',

    // whether to write new locale information to disk
    updateFiles: false
};

miitoo.register('i18nConfig', config, true);