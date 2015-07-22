//Load MailChimp
var mailchimp_api = require('mailchimp-api');

// Load the configuration
var config = miitoo.get('MailChimpConfig');

// Initialize MailChimp
var mailchimp = new mailchimp_api.Mailchimp(config.api_key);

// Register the MailChimp instance as a singleton
miitoo.register('MailChimp', mailchimp, true);