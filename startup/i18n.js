// Load i18n
var i18n = require('i18n');

// Get configuration
var config = miitoo.get('i18nConfig');

// Configure i18n
i18n.configure(config);

// Register the jwt instance as a singleton
miitoo.register('i18n', i18n, true);