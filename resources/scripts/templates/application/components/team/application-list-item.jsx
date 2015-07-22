'use strict';

// Include requirements
var TeamStore   = require('application/stores/team-store'),
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
                    <input type="checkbox" checked={application.public} readOnly /> {this.props.text.public}
                </span>
                <span>
                    <button className='btn btn-danger ml20'>
                        <i className="fa fa-trash-o"></i>
                    </button>
                </span>
            </div>
        );
    }
});

module.exports = ApplicationListItem;