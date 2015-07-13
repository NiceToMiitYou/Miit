
// Load all libs
global.AsyncQueue   = require('./lib/async-queue');
global.classNames   = require('./lib/class-names');
global.DataStore    = require('./lib/data-store');
global.EventEmitter = require('./lib/event-emitter');
global.KeyMirror    = require('./lib/key-mirror');
global.ObjectAssign = require('./lib/object-assign');
global.MiitUtils    = require('./lib/utils');

// Extensions
require('./lib/array-extensions');
require('./lib/event-emitter-extensions');
require('./lib/string-extensions');