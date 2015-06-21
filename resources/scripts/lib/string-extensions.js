(function(){
    String.prototype.capitalize = function(){
        return this.toLowerCase().replace(/\b\w/g, function (m) {
            return m.toUpperCase();
        });
    };

    String.prototype.dashToCapitalize = function(){
        return this.replace(/_/g, ' ').capitalize().replace(/ /g, '');
    };
})();