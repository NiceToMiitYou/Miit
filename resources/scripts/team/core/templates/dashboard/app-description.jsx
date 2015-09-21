'use strict';

// Include translations
var Translations = require('core/translation');

// Include components
var Swapper = require('templates/swapper.jsx')

var AppDescription = React.createClass({
    getDefaultProps: function() {
        return {
            application: {},
            even: true
        };
    },

    render: function() {
        var applications = MiitApp.shared.get('applications'),
            application  = this.props.application,
            informations = applications[application.identifier];

        var name        = Translations[application.identifier].name,
            description = Translations[application.identifier].long_description,
            appClasses  = classNames('fa', 'fa-' + informations.icon, 'bg-' + informations.color);

        var classes = classNames('miit-component app-description', (this.props.even) ? 'even' : 'odd');

        var icon = (
            <div className="app-icon">
                <span className="miit-app-icon">
                    <i className={appClasses}></i>
                </span>
            </div>
        );

        var content = (
            <div className="app-content">
                <h4 className="title">{name}</h4>
                <p className="description" dangerouslySetInnerHTML={{__html: description}} />
            </div>
        );

        return (
            <Swapper className={classes} left={icon} right={content} swapped={!this.props.even} />
        );
    }
});

module.exports = AppDescription;
