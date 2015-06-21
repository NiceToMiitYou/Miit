//Load jwt
var jwt = require('jsonwebtoken');

// Load the config
var config = miitoo.get('MiitConfig');

// Create a wrapper
var JwtWrapper = {
    decode: function(token, options) {
        return jwt.decode(token, options);
    },

    sign: function(payload, options) {
        return jwt.sign(payload, config.tokenSecret, options);
    },

    verify: function(token, options, callback) {
        return jwt.verify(token, config.tokenSecret, options, callback);
    }
};

// Register the jwt instance as a singleton
miitoo.register('Jwt', JwtWrapper, true);