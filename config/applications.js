'use strict';

var config = {};

// Definition of the Chat
config['APP_CHAT'] = {
    // Has public and private access
    canBePrivate: true,

    // Pricing applied for User
    userPricing: 0.1,

    // Pricing applied for Anonym (1euro for 1000 anonyms)
    anonymPricing: 0.001
};

// Definition of the Quizz
config['APP_QUIZZ'] = {
    // Has public and private access
    canBePrivate: true,

    // Pricing applied for User
    userPricing: 0.1,

    // Pricing applied for Anonym (1euro for 1000 anonyms)
    anonymPricing: 0.001
};

// Definition of the Document
config['APP_DOCUMENTS'] = {
    // Has public and private access
    canBePrivate: true,

    // Pricing applied for User
    userPricing: 0.1,

    // Pricing applied for Anonym (1euro for 1000 anonyms)
    anonymPricing: 0.001
};

miitoo.register('MiitApplications', config, true);