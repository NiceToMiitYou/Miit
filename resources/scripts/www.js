'use strict';

// Include React as npm package
global.React = require('react');

// Include components
var CreateTeam = require('templates/www/create-team.jsx'),
    NewsLetter = require('templates/www/news-letter.jsx');

global.onload = function(){
    React.render(<CreateTeam />, document.getElementById('create-team'));
    //React.render(<NewsLetter />, document.getElementById('create-team'));
};