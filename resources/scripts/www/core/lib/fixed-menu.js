
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

function openApp() {
    var i;
    smoothScroll("apps-desc")
    var openApps = document.getElementsByClassName("app");

    for (i=0; i < openApps.length; i++) {
        removeClass('open', openApps.item(i));
    }

    for (i = 0; i < arguments.length; i++) {
        var app = document.getElementById("app"+arguments[i]);
        addClass("open", app)
    }
}

function currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}

function elmYPosition(eID) {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    } return y;
}

function smoothScroll(eID) {
    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
        scrollTo(0, stopY); return;
    }
    var speed = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
        for ( var i=startY; i<stopY; i+=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY += step; if (leapY > stopY) leapY = stopY; timer++;
        } return;
    }
    for ( var i=startY; i>stopY; i-=step ) {
        setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
        leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
    }
}

window.openApp = openApp;
window.smoothScroll = smoothScroll;