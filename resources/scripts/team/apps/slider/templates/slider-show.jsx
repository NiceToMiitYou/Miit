'use strict';

// Include core requirements
var UserStore = MiitApp.require('core/stores/user-store'),
    PageStore = MiitApp.require('core/stores/page-store');

// Include requirements
var SliderActions = require('slider-actions'),
    SliderStore   = require('slider-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include components
var SliderShowSlide = require('templates/slider-show-slide.jsx');

var SliderShow = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                title:   'Présentation',
                publish: 'Publier',
                close:   'Cloturer',
                reopen:  'Ré-ouvrir'
            }
        };
    },

    getInitialState: function () {
        return {
            presentation: this.props.presentation,
            currentSlide: 0
        };
    },

    componentDidMount: function() {
        SliderStore.addPresentationsRefreshedListener(this._onChange);
        this._onChange();
    },

    componentWillUnmount: function() {
        SliderStore.removePresentationsRefreshedListener(this._onChange);
    },

    _onChange: function() {
        var presentationId = PageStore.getArgument(),
            presentation   = SliderStore.getPresentation(presentationId);

        if(!presentation) {
            return;
        }

        // Define the presentation
        this.setState({
            presentation: presentation
        });
    },

    onClose: function() {
        var presentation = this.state.presentation;

        SliderActions.close(presentation.id);
    },

    onReopen: function() {
        var presentation = this.state.presentation;

        SliderActions.reopen(presentation.id);
    },

    onPublish: function() {
        var presentation = this.state.presentation;

        SliderActions.publish(presentation.id);
    },

    onClickNextSlide: function() {
        this.setState({
            currentSlide: this.state.currentSlide+1
        });
        console.log(this.state.currentSlide);
    },

    render: function() {
        var presentation = this.state.presentation;
        var currentSlide = this.state.currentSlide;

        if(!presentation) {
            return null;
        }

        var slides = presentation.slides || [];


        var listStyle = {
          left: -currentSlide*600,
          width: slides.length * 600
        };

        return (
            <div className="miit-component slider-show">
                <div className="page-title mb20">
                    <h2>
                        {this.props.text.title + ' - ' + presentation.name}
                    </h2>
                </div>
                <If test={presentation.description}>
                    <p className="mb20">{presentation.description}</p>
                </If>
                <div className="slider-wrapper">
                    <div className="slide-list" style={listStyle}>
                        {slides.map(function(slide) {
                            return <SliderShowSlide key={'slide-' + slide.id} presentation={presentation.id} slide={slide} />
                        })}
                    </div>
                </div>

                <div className="slider-show-actions">
                    <If test={UserStore.isAdmin() && !presentation.published}>
                        <button className="btn btn-info mr20" onClick={this.onPublish} type="button">
                            <i className="fa fa-paper-plane-o mr5"></i> {this.props.text.publish}
                        </button>
                    </If>

                    <If test={UserStore.isAdmin() && presentation.published && !presentation.closed}>
                        <button className="btn btn-danger mr20" onClick={this.onClose} type="button">
                            <i className="fa fa-lock-o mr5"></i> {this.props.text.close}
                        </button>
                    </If>

                    <If test={UserStore.isAdmin() && presentation.published && presentation.closed}>
                        <button className="btn btn-warning mr20" onClick={this.onReopen} type="button">
                            <i className="fa fa-lock-o mr5"></i> {this.props.text.reopen}
                        </button>
                    </If>
                </div>
                <a className="btn btn-info mt20" onClick={this.onClickNextSlide}>Next</a>
                <span>{currentSlide}</span>
            </div>
        );
    }
});

PageStore.registerApplicationPage('slider', 'show', SliderShow);

module.exports = SliderShow;
