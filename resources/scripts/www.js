'use strict';

// Include React as npm package
global.React = require('react');

// Include components
var CreateTeam = require('templates/create-team.jsx'),
    NewsLetter = require('templates/news-letter.jsx');

global.onload = function(){
    //React.render(<CreateTeam />, document.getElementById('create-team'));
    React.render(<NewsLetter variant={false} />, document.getElementById('create-team'));

    // Keep contact field
    React.render(<NewsLetter variant={true} />, document.getElementById('keep-contact'));
};