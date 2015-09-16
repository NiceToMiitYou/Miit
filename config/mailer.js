var config = {
    from: {
        name:    'Miit',
        address: 'no-reply@miit.fr'
    },

    from_backend: {
        name:    'Miit - Backend',
        address: 'no-reply@itevents.fr'
    },

    smtp: {
        host: 'smtp.mandrillapp.com',
        port: 587,
        auth: {
            user: 'jordan.cortet@itevents.fr',
            pass: 'p_eS6sZUxMlJX0-tzxu3Lw'
        },
        rateLimit: 5
    },

    smtp_backend: {
        host: 'smtp.itevents.fr',
        port: 587,
        auth: {
            user: 'no-reply@itevents.fr',
            pass: 'nopeReply'
        },
        tls: {
            rejectUnauthorized:false
        },
        rateLimit: 1
    },

    backend_team: 'boris.tacyniak@itevents.fr, jordan.cortet@itevents.fr',

    bypass: (process.env.NODE_ENV === 'production') ? false : true,
};

miitoo.register('MailerConfig', config, true);