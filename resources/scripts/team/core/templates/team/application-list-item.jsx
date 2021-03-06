'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    TeamStore   = require('core/stores/team-store'),
    TeamActions = require('core/actions/team-actions');

// Include common
var If = require('templates/if.jsx');

// Load translations from core
var Translations = require('core/translation');

var ApplicationListItem = React.createClass({
    getDefaultProps: function () {
        return {
            application: {},
            text: {
                public: 'Public',
                remove: 'Enlever'
            }
        };
    },
    
    componentDidMount: function() {
        TeamStore.addTeamUpdatedListener(this._onChanged);
    },

    componentWillUnmount: function() {
        TeamStore.removeTeamUpdatedListener(this._onChanged);
    },

    togglePublic: function() {
        if(false === UserStore.isAdmin()) {
            return;
        }

        var application = this.props.application;

        // Send the request to delete the application
        TeamActions.updateApplication(application.identifier, !application.public);
    },

    handleRemove: function() {
        if(false === UserStore.isAdmin()) {
            return;
        }

        var application = this.props.application;

        // Send the request to delete the application
        TeamActions.removeApplication(application.identifier);
    },

    _onChanged: function() {
        this.forceUpdate();
    },

    render: function() {
        var apps = MiitApp.shared.get('applications');

        var application = this.props.application;

        // Add extra informations
        application.name  = Translations[application.identifier].name;
        application.color = apps[application.identifier].color;
        application.icon  = apps[application.identifier].icon;

        var appClasses = classNames('fa', 'fa-' + application.icon, 'bg-' + application.color);

        return (
            <div className="miit-component application-list-item">
                <div className="application-info">
                    <span className="application-icon">
                        <i className={appClasses}></i>
                    </span>
                    <span className="application-name">
                        {application.name}
                    </span>
                </div>
                <div className="application-actions">
                    <If test={TeamStore.isPublic()}>
                        <label className="checkbox-field">
                            <input type="checkbox" className="option-input checkbox" checked={application.public} readOnly onClick={this.togglePublic} /> {this.props.text.public}
                        </label>
                    </If>
                    <span>
                        <button className='btn btn-danger ml20' onClick={this.handleRemove}>
                            <i className="fa fa-trash-o"></i>
                            {this.props.text.remove}
                        </button>
                    </span>
                </div>
            </div>
        );
    }
});

module.exports = ApplicationListItem;