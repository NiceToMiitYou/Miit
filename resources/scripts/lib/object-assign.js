
;(function () {
    'use strict';

    var exports = this;

    function ToObject(val) {
        if (val === null || val === undefined) {
            throw new TypeError('Object.assign cannot be called with null or undefined');
        }

        return Object(val);
    }

    var ObjectAssign = Object.assign || function (target, source) {
        var from;
        var keys;
        var to = ToObject.call({}, target);

        for (var s = 1; s < arguments.length; s++) {
            from = arguments[s];
            keys = Object.keys(Object(from));

            for (var i = 0; i < keys.length; i++) {
                to[keys[i]] = from[keys[i]];
            }
        }

        return to;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return ObjectAssign;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = ObjectAssign;
    }
    else {
        exports.ObjectAssign = ObjectAssign;
    }
}.call(this));