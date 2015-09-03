'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    TeamStore   = require('core/stores/team-store'),
    TeamActions = require('core/actions/team-actions');

// Include common
var If = require('templates/if.jsx');

var Translations = require('core/translation');

var AppStoreListItem = React.createClass({
    getDefaultProps: function () {
        return {
            application: {}
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
        application.name  = Translations[application.identifier].name;
        application.description  = Translations[application.identifier].description;

        var isInstalled = TeamStore.hasApplication(application.identifier);

        var classes    = classNames('miit-component app-store-list-item', (isInstalled) ? 'installed' : 'not-installed'),
            appClasses = classNames('fa', 'fa-' + application.icon, 'bg-' + application.color);

        return (
            <If test={!isInstalled}>
                <div className={classes}>
                    <span className="app-icon">
                        <i className={appClasses}></i>
                    </span>
                    <div className="app-desc">
                        <span>
                            {application.name}
                        </span>
                        <p>
                            {application.description}
                        </p>
                        <button onClick={this.handleAdd} className="btn btn-info btn-sm"><i className="fa fa-plus mr5"></i> Ajouter</button>
                    </div>
                </div>
            </If>
        );
    }
});

module.exports = AppStoreListItem;