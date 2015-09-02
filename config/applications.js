'use strict';

var config = {};

// Definition of the Chat
config['APP_CHAT'] = {
    // The identifier of the app
    identifier: 'APP_CHAT',

    // Background color
    color: 'blue',

    // The icon
    icon: 'weixin'
};

// Definition of the Wall
config['APP_WALL'] = {
    // The identifier of the app
    identifier: 'APP_WALL',

    // Background color
    color: 'purple',

    // The icon
    icon: 'question-circle'
};

// Definition of the Quiz
config['APP_QUIZ'] = {
    // The identifier of the app
    identifier: 'APP_QUIZ',
    
    // Background color
    color: 'green',

    // The icon
    icon: 'question'
};

// Definition of the Document
config['APP_DOCUMENTS'] = {
    // The identifier of the app
    identifier: 'APP_DOCUMENTS',
    
    // Background color
    color: 'red',

    // The icon
    icon: 'file-text'
};

miitoo.register('ApplicationsConfig', config, true);