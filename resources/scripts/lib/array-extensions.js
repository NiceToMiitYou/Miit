
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

Array.prototype.addBy = function(prop, item) {
    if(!item) {
        return;
    }

    // Extract the value of the property
    var value = item[prop];

    // Find by index
    var index = this.indexBy(prop, value);
    if(index === -1) {
        this.push(item);
    }

    return this;
};

Array.prototype.add = function(value) {
    var index = this.indexOf(value);
    if(index === -1) {
        this.push(value);
    }

    return this;
};

Array.prototype.mergeBy = function(prop, values) {
    if(!Array.isArray(values)) {
        values = [values];
    }

    values.forEach(function(value){
        this.addBy(prop, value);
    }.bind(this));

    return this;
};

Array.prototype.merge = function(values) {
    if(!Array.isArray(values)) {
        values = [values];
    }

    values.forEach(function(value){
        this.add(value);
    }.bind(this));

    return this;
};

Array.prototype.removeBy = function(prop, value) {
    var index = this.indexBy(prop, value);
    for(; index >= 0; index = this.indexBy(prop, value)) {
        delete this[index];
    }

    return this;
};

Array.prototype.remove = function(value) {
    var index = this.indexOf(value);
    for(;index >= 0;index = this.indexOf(value)) {
        delete this[index];
    }

    return this;
};

Array.prototype.removeAll = function(values) {
    if(!Array.isArray(values)) {
        values = [values];
    }

    values.forEach(function(value) {
        this.remove(value);
    }.bind(this));

    return this;
};

Array.prototype.hashCode = function() {
    // Generate the hash code
    return JSON.stringify(this).split('').reduce(function(a, b) {
        a = ((a << 5 ) - a ) + b.charCodeAt(0);
        return a & a;
    }, 0);
};