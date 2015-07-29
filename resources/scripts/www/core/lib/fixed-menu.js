
// Add class to an element
function addClass(classname, element) {
    var cn = element.className;

    //test for existance
    if(-1 !== cn.indexOf(classname)) {
        return;
    }
    
    //add a space if the element already has class
    if(cn != '') {
        classname = ' ' + classname;
    }
    
    element.className = cn + classname;
}

// Remove class to an element
function removeClass(classname, element) {
    var rxp = new RegExp('\\s?\\b' + classname + '\\b', 'g');

    element.className = element.className.replace(rxp, '');
}

// Check if we have to fix the menu
function fixedMenu() {
    var d      = document.getElementById('menu');
    var header = document.getElementById('header');

    if(document.body.scrollTop > header.offsetHeight - 20) {
        addClass('fixed', d);
    } else {
        removeClass('show', d);
        removeClass('fixed', d);
    }

    if(document.body.scrollTop > header.offsetHeight + 230) {
        addClass('show', d);
    }
}

// Listen for scroll
if (window.addEventListener) {
    window.addEventListener('scroll', fixedMenu, false);
}
else {
    window.attachEvent('onscroll', fixedMenu);
}