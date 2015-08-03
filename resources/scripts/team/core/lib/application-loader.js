'use strict';

var ScriptLoader = require('./script-loader');

var AppsSrc = '/dist/js/apps/';

var ApplicationsLoaded = {};

global.ApplicationLoader = module.exports = {
    add: function(identifier, cb) {
        var id  = identifier.toSlug(),
            src = AppsSrc + id + '.min.js';

        // Load the script if not load
        if(!ApplicationsLoaded[id]) {
            ScriptLoader.addScript(id, src, cb);

            ApplicationsLoaded[id] = true;
        }
    },

    remove: function(identifier) {
        var id = identifier.toSlug();

        // Load the script if not load
        if(ApplicationsLoaded[id]) {
            ScriptLoader.removeScript(id);

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