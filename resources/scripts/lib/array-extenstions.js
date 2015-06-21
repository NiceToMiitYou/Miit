(function(){
    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };

    Array.prototype.indexBy = function(prop, value) {
        for(var index in this) {
            if(this[index] && this[index][prop] === value) {
                return index;
            }
        }
        return -1;
    };

    Array.prototype.findBy = function(prop, value) {
        var index = this.indexBy(prop, value);

        if(index >= 0) {
            return this[index];
        }
        return null;
    };

    Array.prototype.sortBy = function(prop, order) {
        this.sort(function(a, b){
            var result;

            if(!a || !b)
                return;

            if(a[prop] < b[prop])
            {
                return (order === 'desc') ? 1 : -1;
            } 
            else if(a[prop] > b[prop])
            {
                return (order === 'desc') ? -1 : 1;
            }
            
            return 0;
        });
        return this;
    };

    Array.prototype.removeBy = function(prop, value) {
        var index = this.indexBy(prop, value);
        for(; index >= 0; index = this.indexBy(prop, value)) {
            delete this[index];
        }
    };

    Array.prototype.remove = function(value) {
        var index = this.indexOf(value);
        for(;index >= 0;index = this.indexOf(value)) {
            delete this[index];
        }
    };

    Array.prototype.removeAll = function(values) {
        if(!Array.isArray(values)) {
            values = [values];
        }

        values.forEach(function(value) {
            this.remove(value);
        }.bind(this));
    };

    Array.prototype.merge = function(values) {
        if(!Array.isArray(values)) {
            values = [values];
        }

        values.forEach(function(value){
            if(this.indexOf(value) < 0) {
                this.push(value);
            }
        }.bind(this));
    };
})();