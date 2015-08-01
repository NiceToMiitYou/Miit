
var classes = require('./classes');

// Check if we have to fix the menu
function fixedMenu() {
    var d      = document.getElementById('menu');
    var header = document.getElementById('header');

    if(document.body.scrollTop > header.offsetHeight - 20) {
        classes.add('fixed', d);
    } else {
        classes.remove('show', d);
        classes.remove('fixed', d);
    }

    if(document.body.scrollTop > header.offsetHeight + 230) {
        classes.add('show', d);
    }
}

// Listen for scroll
if (window.addEventListener) {
    window.addEventListener('scroll', fixedMenu, false);
}
else {
    window.attachEvent('onscroll', fixedMenu);
}