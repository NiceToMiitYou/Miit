'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    TeamStore   = require('core/stores/team-store'),
    TeamActions = require('core/actions/team-actions');

// Include common
var If = require('templates/if.jsx');

var Translations = {
    APP_CHAT:      'Chat',
    APP_QUIZ:      'Quiz',
    APP_DOCUMENTS: 'Documents',
};

var AppStoreListItem = React.createClass({
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

    _onChanged: function() {
        this.forceUpdate();
    },

    handleAdd: function() {
        if(false === UserStore.isAdmin()) {
            return;
        }

        var application = this.props.application;

        if(false === TeamStore.hasApplication(application.identifier)) {
            TeamActions.addApplication(application.identifier, false);
        }
    },

    render: function() {
        var application = this.props.application;

        // Add extra informations
        application.name  = Translations[application.identifier];

        var isInstalled = TeamStore.hasApplication(application.identifier);

        var appClasses = classNames('fa', 'fa-' + application.icon, 'bg-' + application.color);
        var installedClass = (isInstalled) ? 'installed' : 'not-installed';

        return (
            <div className={ "miit-component app-store-list-item " + installedClass }>
                <span onClick={this.handleAdd} className="app-icon">
                    <i className={appClasses}></i>
                </span>
                <div className="app-desc">
                    <span>
                        {application.name}
                    </span>
                </div>
            </div>
        );
    }
});

module.exports = AppStoreListItem;