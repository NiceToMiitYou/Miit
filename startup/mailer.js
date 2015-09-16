// Load Node mailer
var nodemailer = require('nodemailer'),
    smtpPool   = require('nodemailer-smtp-pool');

// Load the configuration
var config = miitoo.get('MailerConfig');

// Create SMTP transport for backend if by pass
var smtpTransport = null;

if(false === config.bypass) {
    smtpTransport = nodemailer.createTransport(smtpPool(config.smtp));
} else {
    smtpTransport = nodemailer.createTransport(smtpPool(config.smtp_backend));
}

// Create SMTP transport for backend
var smtpBackendTransport = nodemailer.createTransport(smtpPool(config.smtp_backend));


// Register the Mailer instances as a singleton
miitoo.register('Mailer',        smtpTransport,        true);
miitoo.register('MailerBackend', smtpBackendTransport, true);
