'use strict';

var config = {
    domain: (process.env.NODE_ENV === 'production') ? 'miit.fr' : 'miit.dev',
    port:   8080,

    restrict: {
        subdomains: ['admin', 'api', 'blog', 'cdn', 'contact', 'demo', 'img', 'mdl', 'miit', 'pop3', 'settings', 'smtp', 'support', 'user', 'www']
    },

    gravatar: 'http://www.gravatar.com/avatar/{hash}?s=128&d=identicon',

    tokenSecret: 'MyNameIsMiitJamesMiit'
};

miitoo.register('MiitConfig', config, true);