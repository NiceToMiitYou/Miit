'use strict';

var FileLoader = require('./file-loader');

var AppsJsSrc  = '/dist/js/apps/',
    AppsCssSrc = '/dist/css/apps/';

var ApplicationsLoaded = {};

global.ApplicationLoader = module.exports = {
    add: function(identifier, cb) {
        var id  = identifier.toSlug(),
            js  = AppsJsSrc  + id + '.min.js',
            css = AppsCssSrc + id + '.min.css';

        // Load the script if not load
        if(!ApplicationsLoaded[id]) {
            var loaded = 0;

            // Define the callback of files
            var callback = function() {
                loaded++;

                if(typeof cb === 'function' && 2 === loaded) {
                    cb();
                }
            };

            FileLoader.addStyle(id, css, callback);
            FileLoader.addScript(id, js, callback);

            ApplicationsLoaded[id] = true;
        }
    },

    remove: function(identifier) {
        var id = identifier.toSlug();

        // Load the script if not load
        if(ApplicationsLoaded[id]) {
            FileLoader.removeScript(id);
            FileLoader.removeStyle(id);

            var plugin = ApplicationsLoaded[id];

            if(
                true !== plugin &&
                typeof plugin.onRemove === 'function'
            ) {
                plugin.onRemove();
            }

            delete ApplicationsLoaded[id];
        }
    },

    register: function(identifier, plugin) {
        // If no plugin, load the identifier from the plugin
        if(!plugin) {
            plugin     = identifier;
            identifier = plugin.identifier;
        }

        var id = identifier.toSlug();

        if(
            true === ApplicationsLoaded[id] &&
            typeof plugin === 'object' &&
                   plugin !== null
        ) {
            ApplicationsLoaded[id] = plugin;
            
            if(typeof plugin.onRegister === 'function') {
                plugin.onRegister();
            }
        }
    }
};