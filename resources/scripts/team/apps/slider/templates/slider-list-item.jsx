'use strict';

// Include core requirements
var Router    = MiitApp.require('core/lib/router'),
    UserStore = MiitApp.require('core/stores/user-store');

// Include requirements
var SliderStore = require('slider-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

// Include core templates
var Link = MiitApp.require('core/templates/components/link.jsx');

var SliderListItem = React.createClass({
    getDefaultProps: function () {
        return {
            presentation: {},
            text: {
                show:          'Voir',
                update:        'Modifier',
                nodescription: 'Cette présentation n\'a pas de description.'
            }
        };
    },

    render: function() {
        var presentation = this.props.presentation;

        var classes = classNames('miit-component slider-list-item col-md-6 col-lg-4', (presentation.closed) ? 'closed' : '', (!presentation.converted) ? 'not-converted' : '');
 
        return (
            <div className={classes}>
                <div className="slider-list-item-inner">
                    <h3>{presentation.name}</h3>

                    <If test={presentation.description}>
                        <p>{presentation.description}</p>
                    </If>
                    <If test={!presentation.description}>
                        <p>{this.props.text.nodescription}</p>
                    </If>

                    <div className="slider-list-item-inner-show">
                        <If test={true === presentation.converted}>
                            <Link href={'#/slider/show/' + presentation.id}>{this.props.text.show}</Link>
                        </If>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = SliderListItem;
