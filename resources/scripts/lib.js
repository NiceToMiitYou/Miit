'use strict';

// Load all libs
global.AsyncQueue   = require('async-queue');
global.classNames   = require('class-names');
global.DataStore    = require('data-store');
global.Debounce     = require('debounce-function');
global.EventEmitter = require('event-emitter');
global.KeyMirror    = require('key-mirror');
global.ObjectAssign = require('object-assign');
global.MiitUtils    = require('utils');

// Extensions from shared
require('lib/array-extensions');

// Extensions
require('event-emitter-extensions');
require('string-extensions');