
function HexToRGBA(hex, alpha) {
    var red   = parseInt((TrimHex(hex)).substring(0, 2), 16);
    var green = parseInt((TrimHex(hex)).substring(2, 4), 16);
    var blue  = parseInt((TrimHex(hex)).substring(4, 6), 16);

    return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
}

function TrimHex(hex) {
    return (hex.charAt(0) == '#') ? hex.substring(1, 7) : h;
}

// The Dot element
function Dot(canvas, context, colors) {
    this.active  = true;
    this.canvas  = canvas;
    this.context = context;

    this.diameter = Math.random() * 7;

    this.x = Math.round(Math.random() * canvas.width);
    this.y = Math.round(Math.random() * canvas.height);

    this.velocity = {
        x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.7,
        y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.7
    };

    this.alpha = 0.1;
    this.hex   = colors[Math.round(Math.random() * 3)];
    this.color = HexToRGBA(this.hex, this.alpha);
}

// Define prototypes
Dot.prototype = {
    Update: function() {
        if(this.alpha < 0.8) {
            this.alpha += 0.01;
            this.color = HexToRGBA(this.hex, this.alpha);
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if(this.x > this.canvas.width + 5 || this.x < 0 - 5 || this.y > this.canvas.height + 5 || this.y < 0 - 5) {
            this.active = false;
        }
    },

    Draw: function() {
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.diameter, 0, Math.PI * 2, false);
        this.context.fill();
    }
}

module.exports = Dot;