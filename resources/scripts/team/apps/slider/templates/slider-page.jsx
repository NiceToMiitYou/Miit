'use strict';

// Include requirements
var PageStore = MiitApp.require('core/stores/page-store'),
    TeamStore = MiitApp.require('core/stores/team-store');

// Include Layout
var Layout = MiitApp.require('pages/layouts/default-layout.jsx');

// Include core components
var Login = MiitApp.require('pages/login.jsx');

// Include components
var SliderApp = require('templates/slider-app.jsx');

var SliderPage = React.createClass({
    getDefaultProps: function () {
        return {
            title: 'Présentation'
        };
    },

    render: function() {
        if(false === TeamStore.hasApplication('APP_SLIDER')) {
            return <Login />;
        }

        return (
            <Layout title={this.props.title} fullheight={true}>
                <SliderApp />
            </Layout>
        );
    }
});

PageStore.registerMainPage('slider', SliderPage);

module.exports = SliderPage;
