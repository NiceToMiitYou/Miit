
var classes      = require('./classes'),
    smoothScroll = require('./smooth-scroll');

function openApp() {
    smoothScroll('apps-desc');

    var i, openApps = document.getElementsByClassName('app');

    for (i = 0; i < openApps.length; i++) {
        classes.remove('open', openApps.item(i));
    }

    for (i = 0; i < arguments.length; i++) {
        var app = document.getElementById('app' + arguments[i]);

        classes.add('open', app);
    }
}

global.openApp = openApp;