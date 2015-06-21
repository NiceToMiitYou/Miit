//Load slug
var slug = require('slug');

// Set the default mode
slug.defaults.mode = 'rfc3986';

// Register the slug instance as a singleton
miitoo.register('Slugify', slug, true);