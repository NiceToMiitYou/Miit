

;(function () {
    'use strict';

    var exports = this;

    var classNames = function() {
        var classes = '';

        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (!arg) continue;

            var argType = typeof arg;

            if ('string' === argType || 'number' === argType) {
                classes += ' ' + arg;

            } else if (Array.isArray(arg)) {
                classes += ' ' + classNames.apply(null, arg);

            } else if ('object' === argType) {
                for (var key in arg) {
                    if (arg.hasOwnProperty(key) && arg[key]) {
                        classes += ' ' + key;
                    }
                }
            }
        }

        return classes.substr(1);
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return classNames;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = classNames;
    }
    else {
        exports.classNames = classNames;
    }
}.call(this));