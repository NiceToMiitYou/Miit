'use strict';

function ieLoadBugFix(script, callback) {
    var done = false;

    script.onload = script.onreadystatechange = function() {
        if(
            !done &&
            (
                !this.readyState ||
                 this.readyState === 'loaded' ||
                 this.readyState === 'complete'
            )
        ) {
            done = true;

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;

            if(typeof callback === 'function') {
                callback();
            }
        }
    };
}

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
            ieLoadBugFix(style, cb);

            document.getElementsByTagName('head')[0].appendChild(style);
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
            ieLoadBugFix(script, cb);

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