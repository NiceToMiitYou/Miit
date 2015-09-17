'use strict';

// Include requirements
var PageStore = require('core/stores/page-store');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

// Include components
var Link            = require('core/templates/components/link.jsx'),
    AppStoreList    = require('core/templates/app-store/app-store-list.jsx');

var WelcomePage = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                title:         'Bienvenue sur Miit',
                home:          'Retour à l\'accueil',
                subtitle:      'Découvrez les nombreuses posssibilités de pérsonnalisation qui s\'offrent à vous.',
                apps:          'Applications:',
                addApps:       'Ajouter les applications',
                templates:     'Pour commencer rapidement à communiquer vous pouvez choisir un modèle de Miit.'

            }
        };
    },

    render: function() {
        return (
            <Layout>
                <div className="container-fluid welcome center">
                        <h2 className="mt40">
                            <i className="icon-logo-miit mr10"></i>
                            {this.props.text.title}
                        </h2>

                    <h3 className="mt40">
                        {this.props.text.subtitle}
                    </h3>

                    <p className="mt40">
                        {this.props.text.templates}
                    </p>
                    <div className="row mt20 templates">
                        <div className="col-md-4 col-lg-4 mb20">
                            <div className="panel small">
                                <h2 className="panel-title">Conférences</h2>
                                <div className="panel-content">
                                    <p className="mb20">Construisez un espace de communication pour les conférences avec un chat, des questionnaires et mur de questions</p>
                                    <span>{this.props.text.apps}</span>
                                    <div>
                                        <span className="miit-app-icon">
                                            <i className="fa fa-comments-o bg-blue"></i>
                                        </span>
                                        <span className="miit-app-icon">
                                            <i className="fa fa-check-square-o bg-green"></i>
                                        </span>
                                        <span className="miit-app-icon">
                                            <i className="fa fa-question-circle bg-purple"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="panel-footer">
                                    <i className="fa fa-plus mr10"></i>{this.props.text.addApps}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 mb20">
                            <div className="panel small">
                                <h2 className="panel-title">Réunion</h2>
                                <div className="panel-content">
                                    <p className="mb20">Construisez un espace pour simplifier vos réunions grace à un chat, un partage de documents et un mur de questions</p>
                                    <span>{this.props.text.apps}</span>
                                    <div>
                                        <span className="miit-app-icon">
                                            <i className="fa fa-comments-o bg-blue"></i>
                                        </span>
                                        <span className="miit-app-icon">
                                            <i className="fa fa-folder-open-o bg-red"></i>
                                        </span>
                                        <span className="miit-app-icon">
                                            <i className="fa fa-question-circle bg-purple"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="panel-footer">
                                    <i className="fa fa-plus mr10"></i>{this.props.text.addApps}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 mb20">
                            <div className="panel small">
                                <h2 className="panel-title">Equipe</h2>
                                <div className="panel-content">
                                    <p className="mb20">Gardez le contact et echanger facilement avec votre/vos equipe(s) avec un simple chat et un partage de documents</p>
                                    <span>{this.props.text.apps}</span>
                                    <div>
                                        <span className="miit-app-icon">
                                            <i className="fa fa-comments-o bg-blue"></i>
                                        </span>
                                        <span className="miit-app-icon">
                                            <i className="fa fa-folder-open-o bg-red"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="panel-footer">
                                    <i className="fa fa-plus mr10"></i>{this.props.text.addApps}
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="mb20 mt20">
                        <b>Ou</b> créer un espace pesonnalisé en ajoutant vous même des applications.
                    </p>

                    <AppStoreList />
                </div>
            </Layout>
        );
    }
});

PageStore.registerMainPage('welcome', WelcomePage);

module.exports = WelcomePage;