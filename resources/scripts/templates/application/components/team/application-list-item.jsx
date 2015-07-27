'use strict';

// Include requirements
var UserStore   = require('application/stores/user-store'),
    TeamStore   = require('application/stores/team-store'),
    TeamActions = require('application/actions/team-actions');

// Include common
var If = require('templates/common/if.jsx');

var Translations = {
    APP_CHAT:      'Chat',
    APP_QUIZZ:     'Quizz',
    APP_DOCUMENTS: 'Documents',
};

var ApplicationListItem = React.createClass({
    getDefaultProps: function () {
        return {
            application: {},
            text: {
                public: 'Publique'
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
        application.name  = Translations[application.identifier];
        application.color = apps[application.identifier].color;
        application.icon  = apps[application.identifier].icon;

        var appClasses = classNames('fa', 'fa-' + application.icon, 'bg-' + application.color);

        return (
            <div className="miit-component application-list-item">
                <span>
                    <i className={appClasses}></i>
                </span>
                <span>
                    {application.name}
                </span>
                <span>
                    <input type="checkbox" checked={application.public} readOnly onClick={this.togglePublic} /> {this.props.text.public}
                </span>
                <span>
                    <button className='btn btn-danger ml20' onClick={this.handleRemove}>
                        <i className="fa fa-trash-o"></i>
                    </button>
                </span>
            </div>
        );
    }
});

module.exports = ApplicationListItem;