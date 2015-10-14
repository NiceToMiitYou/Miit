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

        var url = window.MiitUrl + presentation + '/' + slide.id + '.png';

        return (
            <div className="miit-component slider-show-slide container-fluid">
                <img src={url} />
            </div>
        );
    }
});

module.exports = SliderShowSlide;
