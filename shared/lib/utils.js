
;(function () {
    'use strict';

    var exports = this;

    /**
     * Validator part
     */

    // Regex for email
    var RegexEmail    = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    // Regex for team name
    var RegexTeamName = /^[a-z0-9 ]{4,}$/i;

    // Regex for password
    var RegexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\ `\~\!\@#\$%\^\&\*\(\)_\-\+\=\{\}\[\]\\\|\:\;\"\'\<\>\,\.\?\/]{8,}$/;

    // Regex for user name
    var RegexUserName = /^[0-9a-zA-Z_\'\-\. ]{4,42}$/i;

    // Generate the validator for a regex
    var validatorGenerator = function(re) {
        // Return the validation function
        return function(value) {
            // Test the regex
            return re.test(value);
        };
    };

    var guidGenerator = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    /**
     * Ajax part
     */

    // get the list of HttpRequestHandlers
    var XMLHttpFactories = [
        function () {return new XMLHttpRequest();},
        function () {return new ActiveXObject('Msxml2.XMLHTTP');},
        function () {return new ActiveXObject('Msxml3.XMLHTTP');},
        function () {return new ActiveXObject('Microsoft.XMLHTTP');}
    ];

    // Generator of HttpRequestHandler
    function createXMLHTTPObject() {
        var xmlhttp = false;
        for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
            }
            catch (e) {
                continue;
            }
            break;
        }
        return xmlhttp;
    }

    // Send request method
    var sendRequest = function(url, postData, headers, cb) {
        var req = createXMLHTTPObject();

        if(!req) return;

        if(typeof headers === 'function') {
            cb      = headers;
            headers = null;
        }
        else if(typeof postData === 'function') {
            cb       = postData;
            postData = null;
        }
        
        var method = (postData) ? 'POST' : 'GET';
        
        req.open(method, url, true);
        
        if(postData) {
            req.setRequestHeader('Content-type', 'application/json');
        }

        if(headers) {
            // Foreach header
            for(var header in headers) {
                // Set the header
                req.setRequestHeader(header, headers[header]);
            }
        }

        req.onreadystatechange = function () {
            if (req.readyState != 4) return;
            var result;

            try {
                result = JSON.parse(req.responseText);
            } catch(e) { }

            if(typeof cb === 'function') {
                cb(result || {}, req);
            }
        };
        
        if (req.readyState == 4) return;

        req.send(JSON.stringify(postData));
    };

    // Return the public object
    var MiitUtils = {
        ajax: {
            send: sendRequest
        },

        validator: {
            email:    validatorGenerator(RegexEmail),
            password: validatorGenerator(RegexPassword),
            team:     validatorGenerator(RegexTeamName),
            user:     validatorGenerator(RegexUserName)
        },

        generator: {
            guid: guidGenerator
        }
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return MiitUtils;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = MiitUtils;
    }
    else {
        exports.MiitUtils = MiitUtils;
    }
}.call(this));