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
                title:            'Présentation',
                publish:          'Publier',
                close:            'Cloturer',
                close_sentence:   'Votre présentation n\'est pas diffusé au public.',
                open_sentence:    'Votre présentation est diffusé au public.',
                publish_sentence: 'Votre présentation n\'est pas publié. Les slides ne changeront que sur votre écran.',
                reopen:           'Ré-ouvrir',
                next:             'Suivant',
                previous:         'Précédent',
                fullscreen:       'Plein-écran',
                leave_fullscreen: 'Quitter le plein-écran'
            }
        };
    },

    getInitialState: function () {
        return {
            presentation: this.props.presentation,
            currentSlide: 0,
            sticky:       true,
            fullscreen:   false
        };
    },

    componentDidMount: function() {
        SliderStore.addPresentationsRefreshedListener(this._onChange);
        SliderStore.addSlideChangedListener(this._onSlideChange);
        this.attachEventListener();
        this._onChange();
    },

    componentWillUnmount: function() {
        SliderStore.removePresentationsRefreshedListener(this._onChange);
        SliderStore.removeSlideChangedListener(this._onSlideChange);
        this.detachEventListener();
    },

    attachEventListener: function() {
        if(window.addEventListener)
        {
            window.addEventListener('keydown', this.onKeyDown, false); 
        }
        else if(window.attachEvent)
        {
            window.attachEvent('onkeydown', this.onKeyDown);
        }
    },

    detachEventListener: function () {
        if(window.removeEventListener)
        {
            window.removeEventListener('keydown', this.onKeyDown, false); 
        }
        else if(window.detachEvent)
        {
            window.detachEvent('onkeydown', this.onKeyDown);
        }
    },

    onKeyDown: function(e) {
        var keyCode = e.keyCode ? e.keyCode : e.which;

        switch(keyCode) {
            case 27:
                this.setState({
                    fullscreen: false
                });
                break;

            case 37:
                this.onClickPreviousSlide();
                break;

            case 39:
                this.onClickNextSlide();
                break;
        }
    },

    _onChange: function() {
        var presentationId = PageStore.getArgument(),
            presentation   = SliderStore.getPresentation(presentationId);

        if(!presentation) {
            return;
        }

        // Define the presentation
        this.setState({
            presentation: presentation,
            currentSlide: presentation.current
        });
    },

    _onSlideChange: function(presentationId, current) {
        var presentation = this.state.presentation,
            currentSlide = this.state.currentSlide,
            sticky       = this.state.sticky;

        if(
            presentationId === presentation.id &&
            (
                true    === sticky ||
                current === currentSlide
            )
        ) {

            this.setState({
                currentSlide: current,
                sticky:       true
            });
        }
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

    onClickFullscreen: function() {
        this.setState({
            fullscreen: !this.state.fullscreen
        });
    },

    onClickNextSlide: function() {
        var presentation = this.state.presentation,
            currentSlide = this.state.currentSlide;

        // Check limitation
        if(currentSlide >= presentation.slides.length - 1)
        {
            return;
        }

        // If is Admin, apply to all else, local change
        if(true === UserStore.isAdmin())
        {
            SliderActions.next(presentation.id);
        }
        else if(currentSlide < presentation.current)
        {
            this.setState({
                currentSlide: currentSlide + 1,
                sticky:       currentSlide + 1 === presentation.current
            });
        }
    },

    onClickPreviousSlide: function() {
        var presentation = this.state.presentation,
            currentSlide = this.state.currentSlide;

        // Check limitation
        if(currentSlide <= 0)
        {
            return;
        }

        // If is Admin, apply to all else, local change
        if(true === UserStore.isAdmin())
        {
            SliderActions.previous(presentation.id);
        }
        else
        {
            this.setState({
                currentSlide: currentSlide - 1,
                sticky:       false
            });
        }
    },

    render: function() {
        var presentation = this.state.presentation,
            currentSlide = this.state.currentSlide;

        if(!presentation) {
            return null;
        }

        var slides = presentation.slides || [];

        var listStyle = {
            left:  -currentSlide * 100 + '%',
            width: slides.length * 100 + '%'
        };

        var progressStyle = {
            width: (currentSlide*100)/(slides.length-1) + '%'
        }

        var SliderShowClasses = classNames('miit-component', 'slider-show', this.state.fullscreen==true ? 'fullscreen ' : '');

        return (
            <div className={SliderShowClasses}>
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
                            return <SliderShowSlide key={'slide-' + slide.id} presentation={presentation.id} slidesLength={slides.length} slide={slide} />
                        })}
                    </div>
                </div>

                <div className="slider-show-actions">
                    <If test={UserStore.isAdmin() && !presentation.published}>
                        <div className="slide-show-stat">
                            <span> <i className="fa fa-circle stat-config mr5"></i> {this.props.text.publish_sentence}</span>
                            <a onClick={this.onPublish}>
                                <i className="fa fa-paper-plane-o mr5"></i> {this.props.text.publish}
                            </a>
                        </div>
                    </If>

                    <If test={UserStore.isAdmin() && presentation.published && !presentation.closed}>
                        <div className="slide-show-stat">
                            <span> <i className="fa fa-circle stat-open mr5"></i> {this.props.text.open_sentence}</span>
                            <a onClick={this.onClose}>
                                <i className="fa fa-lock mr5"></i> {this.props.text.close}
                            </a>
                        </div>
                    </If>

                    <If test={UserStore.isAdmin() && presentation.published && presentation.closed}>
                        <div className="slide-show-stat">
                            <span> <i className="fa fa-circle stat-ready mr5"></i> {this.props.text.close_sentence}</span>
                            <a onClick={this.onReopen}>
                                <i className="fa fa-paper-plane-o mr5"></i> {this.props.text.reopen}
                            </a>
                        </div>
                    </If>
                    <div className="sliders-show-commands">
                        <div className="slider-show-progress">
                            <div className="progress-bar">
                                <div className="progress-bar-inner bg-blue" style={progressStyle}></div>
                            </div>
                            <span className="progress-page">{currentSlide+1}/{slides.length || 0}</span>
                        </div>
                        <div className="slider-show-controlers">
                            <a className="btn-previous-slide" onClick={this.onClickPreviousSlide}>
                                {this.props.text.previous}
                            </a>
                            <a className="btn-next-slide" onClick={this.onClickNextSlide}>
                                {this.props.text.next}
                            </a>
                        </div>
                        <a className="slider-show-fullscreen" onClick={this.onClickFullscreen}>
                            {this.state.fullscreen==true ? 
                                this.props.text.leave_fullscreen : 
                                this.props.text.fullscreen
                            }
                        </a>
                    </div>
                </div>
            </div>
        );
    }
});

PageStore.registerApplicationPage('slider', 'show', SliderShow);

module.exports = SliderShow;
