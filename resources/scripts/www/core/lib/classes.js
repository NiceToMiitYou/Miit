
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

module.exports = {
    add:    addClass,
    remove: removeClass
};