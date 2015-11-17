'use strict';

// Include core requirements
var Router       = MiitApp.require('core/lib/router'),
    UserStore    = MiitApp.require('core/stores/user-store'),
    ModalActions = MiitApp.require('core/actions/modal-actions');

// Include requirements
var SliderStore = require('slider-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include template
var SliderListItem = require('templates/slider-list-item.jsx'),
    SliderUpload   = require('templates/slider-upload.jsx');

var SliderList = React.createClass({
    componentDidMount: function() {
        SliderStore.addPresentationsRefreshedListener(this._onChange);
    },

    componentWillUnmount: function() {
        SliderStore.removePresentationsRefreshedListener(this._onChange);
    },

    _onChange: function() {
        this.forceUpdate();
    },

    getDefaultProps: function () {
        return {
            text: {
                title: 'Liste de présentations'
            },
            identifier: 'APP_SLIDER'
        };
    },

    render: function() {
        var presentations = SliderStore.getPresentations(),
            identifier    = this.props.identifier;

        if(1 === presentations.length && false === UserStore.isAdmin()) {

            // Get the first id
            var presentationId = presentations[0].id || '';

            Router.setRoute('/slider/show/' + presentationId);

            return null;
        }

        return (
            <div className="miit-component slider-list">
                <div className="page-title mb30">
                    <h2><i className="fa fa-th-list mr15"></i>{this.props.text.title}</h2>
                </div>
                
                <div className="list">
                    {presentations.map(function(presentation) {
                        return <SliderListItem key={'presentation-' + presentation.id} presentation={presentation} />;
                    })}

                    <If test={true === UserStore.isAdmin()}>
                        <SliderUpload application={identifier} />
                    </If>
                </div>
            </div>
        );
    }
});

module.exports = SliderList;
