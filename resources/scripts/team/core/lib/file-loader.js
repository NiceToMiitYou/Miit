'use strict';

module.exports = {
    addStyle: function(id, src, cb) {
        id = 'style-' + id;

        var element = document.getElementById(id);

        if(!element) {
            var style = document.createElement('link');

            // Set all attributes
            style.setAttribute('id',   id);
            style.setAttribute('href', src);
            style.setAttribute('rel',  'stylesheet');
            style.setAttribute('type', 'text/css')
            style.onload = cb;

            document.head.appendChild(style);
        }
    },

    addScript: function(id, src, cb) {
        id = 'script-' + id;

        var element = document.getElementById(id);

        if(!element) {
            var script = document.createElement('script');

            // Set all attributes
            script.setAttribute('id',  id);
            script.setAttribute('src', src);
            script.onload = cb;

            document.body.appendChild(script);
        }
    },

    removeScript: function(id) {
        id = 'script-' + id;

        var element = document.getElementById(id);

        if(element) {
            element.parentNode.removeChild(element);
        }
    },

    removeStyle: function(id) {
        id = 'style-' + id;

        var element = document.getElementById(id);

        if(element) {
            element.parentNode.removeChild(element);
        }
    }
};