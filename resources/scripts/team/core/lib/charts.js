'use strict';

// retreive the library
var ChartJS     = require('chart.js'),
    ReactCharts = require('react-chartjs');

// configure the library
ChartJS.defaults.global.responsive = true;


// configure default colors
var colors     = ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
var highlights = ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774'];

function selector(array) {
    return function(index) {
        var max = array.length;

        if(0 >= max) {
            return '#000';
        }

        return array[index % max];
    };
}

module.exports = {
    charts: ReactCharts,

    color: selector(colors),

    highlight: selector(highlights)
};
