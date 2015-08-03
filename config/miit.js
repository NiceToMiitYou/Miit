'use strict';

var config = {
    domain: (process.env.NODE_ENV === 'production') ? 'miit.fr' : 'miit.dev',
    port:   8080,

    restrict: {
        subdomains: ['admin', 'api', 'blog', 'demo', 'miit', 'pop3', 'settings', 'smtp', 'support', 'www']
    },

    tokenSecret: 'MyNameIsMiitJamesMiit'
};

miitoo.register('MiitConfig', config, true);