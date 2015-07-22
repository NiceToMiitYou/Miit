'use strict';

// Application settings
var VERSION   = '0.0.0';
var COPYRIGHT = 'All rights reserved to ITEvents.';

// Application DataStore
var shared    = new DataStore('shared');

// Set up moment.js to load locales
var Moment = require('moment');

// Load locales
require('moment/locale/fr');


module.exports = {
    COPYRIGHT: COPYRIGHT,
    VERSION:   VERSION,
    shared:    shared
};
