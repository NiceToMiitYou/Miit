'use strict';

var config = {};

// Definition of the Chat
config['APP_CHAT'] = {
    // Pricing applied for User
    userPricing: 0.1,

    // Pricing applied for Anonym (1euro for 1000 anonyms)
    anonymPricing: 0.001,

    // Background color
    color: 'blue',

    // The icon
    icon: 'weixin'
};

// Definition of the Quizz
config['APP_QUIZZ'] = {
    // Pricing applied for User
    userPricing: 0.1,

    // Pricing applied for Anonym (1euro for 1000 anonyms)
    anonymPricing: 0.001,

    // Background color
    color: 'green',

    // The icon
    icon: 'question'
};

// Definition of the Document
config['APP_DOCUMENTS'] = {
    // Pricing applied for User
    userPricing: 0.1,

    // Pricing applied for Anonym (1euro for 1000 anonyms)
    anonymPricing: 0.001,

    // Background color
    color: 'red',

    // The icon
    icon: 'file-text'
};

miitoo.register('ApplicationsConfig', config, true);