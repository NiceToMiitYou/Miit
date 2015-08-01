'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    TeamStore   = require('core/stores/team-store'),
    TeamActions = require('core/actions/team-actions');

// Include common
var If = require('templates/if.jsx');

var Translations = {
    APP_CHAT:      'Chat',
    APP_QUIZZ:     'Quizz',
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
            console.log('Application:', Translations[application.identifier], 'Added');

            TeamActions.addApplication(application.identifier, false);
        }
    },

    render: function() {
        var application = this.props.application;

        // Add extra informations
        application.name  = Translations[application.identifier];

        var appClasses = classNames('fa', 'fa-' + application.icon, 'bg-' + application.color);

        return (
            <div className="miit-component app-store-list-item">
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