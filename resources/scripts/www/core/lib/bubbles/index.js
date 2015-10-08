// Load dot class
var Dot = require('./dot');

// Polyfill for ie9
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];

    for(var x = 0; x < vendors.length && !global.requestAnimationFrame; ++x) {
        global.requestAnimationFrame = global[vendors[x]+'RequestAnimationFrame'];
        global.cancelAnimationFrame =
          global[vendors[x]+'CancelAnimationFrame'] || global[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!global.requestAnimationFrame) {
        global.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = global.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!global.cancelAnimationFrame) {
        global.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

var Bubbles = function(id) {
    var canvas  = document.getElementById(id);

    if(!canvas) {
        return;
    }

    var context = canvas.getContext('2d');

    canvas.width  = global.innerWidth;
    canvas.height = global.innerHeight;

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

    global.onresize = Debounce(function(event) {
        Dots = [];
        canvas.width  = global.innerWidth;
        canvas.height = global.innerHeight;
    }, 100);

    Update();
};

module.exports = Bubbles;