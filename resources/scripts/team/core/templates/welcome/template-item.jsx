'use strict';

// Include requirements
var Router               = require('core/lib/router'),
    TeamActions          = require('core/actions/team-actions'),
    NotificationsActions = require('core/actions/notifications-actions');

var TemplateItem = React.createClass({
    getDefaultProps: function() {
        return {
            template: {},
            text: {
                apps:    'Applications:',
                addApps: 'Ajouter les applications',
                success: 'Les applications viennent d\'être ajouté à votre Miit.'
            }
        };
    },

    onAddApplications: function() {
        var template = this.props.template,
            apps     = template.apps || [];

        apps.forEach(function(app) {
            // Register the application
            TeamActions.addApplication(app, false);
        });

        NotificationsActions.notify('success', this.props.text.success, 2500);

        Router.setRoute('/settings');
    },

    render: function() {
        var applications = MiitApp.shared.get('applications'),
            template     = this.props.template,
            apps         = template.apps || [];

        return (
            <div className="col-md-4 col-lg-4 mb20">
                <div className="panel small">
                    <h2 className="panel-title">{template.title}</h2>
                    <div className="panel-content">
                        <p className="mb20">{template.description}</p>
                        <span>{this.props.text.apps}</span>
                        <div>
                            {apps.map(function(app) {
                                var application = applications[app],
                                    appClasses  = classNames('fa', 'fa-' + application.icon, 'bg-' + application.color);

                                return (
                                    <span key={'template-apps-' + app} className="miit-app-icon">
                                        <i className={appClasses}></i>
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <div className="panel-footer" onClick={this.onAddApplications}>
                        <i className="fa fa-plus mr10"></i> {this.props.text.addApps}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = TemplateItem;
