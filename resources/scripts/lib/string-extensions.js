'use strict';

String.prototype.capitalize = function(){
    return this.toLowerCase().replace(/\b\w/g, function (m) {
        return m.toUpperCase();
    });
};

String.prototype.dashToCapitalize = function(){
    return this.replace(/_/g, ' ').capitalize().replace(/ /g, '');
};

String.prototype.toSlug = function(){
    return this.toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/_+/g, '-')            // Replace dash with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
};