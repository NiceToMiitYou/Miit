// Load dot class
var Dot = require('./dot');

var Bubbles = function(id) {
    var canvas  = document.getElementById(id);
    var context = canvas.getContext('2d');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    var Dots    = [];
    var colors  = ['#1e2d3a', '#3076A0', '#1e2d3a', '#3191D0'];
    var maximum = 50;

    function GenerateDots() {
        if(Dots.length < maximum) {
            for(var i = Dots.length; i < maximum; i++) {
                Dots.push(new Dot(canvas, context, colors));
            }
        }

        return false;
    }

    function Update() {
        GenerateDots();

        Dots.forEach(function(Dot) {
            Dot.Update();
        });

        Dots = Dots.filter(function(Dot) {
            return Dot.active;
        });

        Render();
        requestAnimationFrame(Update);
    }

    function Render() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        Dots.forEach(function(Dot) {
            Dot.Draw();
        });
    }

    window.onresize = function(event) {
        Dots = [];
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    Update();
};

module.exports = Bubbles;