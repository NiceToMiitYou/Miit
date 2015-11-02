'use strict';

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var SliderShowSlide = React.createClass({
    getDefaultProps: function () {
        return {
            presentation: '',
            slide: {}
        };
    },

    render: function() {
        var presentation = this.props.presentation,
            slide        = this.props.slide;

        if(!presentation || !slide) {
            return null;
        }

        var slidesLength = this.props.slidesLength;

        var slideStyle = {
            width: 100/slidesLength + '%'
        }

        var url = window.MiitUrl + presentation + '/' + slide.id + '.png';

        return (
            <div className="miit-component slider-show-slide" style={slideStyle}>
                <img src={url} />
            </div>
        );
    }
});

module.exports = SliderShowSlide;
