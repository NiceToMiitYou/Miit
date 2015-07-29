'use strict';

// Include React as npm package
global.React = require('react');

// Load Analytics
require('core/lib/google-analytics');

// Load the handler of fixed menu
require('core/lib/fixed-menu');

// Include requierements
var Bubbles = require('core/lib/bubbles');

// Include components
var CreateTeam = require('templates/create-team.jsx'),
    NewsLetter = require('templates/news-letter.jsx');

global.onload = function() {
    Bubbles('canvas');

    //React.render(<CreateTeam />, document.getElementById('create-team'));
    React.render(<NewsLetter variant={false} />, document.getElementById('create-team'));

    // Keep contact field
    React.render(<NewsLetter variant={true} />, document.getElementById('keep-contact'));
};