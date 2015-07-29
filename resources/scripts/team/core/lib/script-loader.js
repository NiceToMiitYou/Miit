'use strict';

module.exports = {
    addScript: function(id, src, cb) {
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
        var element = document.getElementById(id);

        if(element) {
            element.parentNode.removeChild(element);
        }
    }
};