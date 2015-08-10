
;(function () {
    'use strict';
    
    function DebounceFunction(func, wait, immediate) {
        var timeout;

        return function() {
            var context = this, args = arguments;
            
            var later = function() {
                timeout = null;
                
                if (!immediate) {
                    func.apply(context, args);
                }
            };

            var callNow = immediate && !timeout;
            
            clearTimeout(timeout);
            
            timeout = setTimeout(later, wait);
            
            if(callNow) {
                func.apply(context, args);
            }
        };
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return DebounceFunction;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = DebounceFunction;
    }
    else {
        exports.DebounceFunction = DebounceFunction;
    }
}.call(this));