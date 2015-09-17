'use strict';

// Include requirements
var PageStore = require('core/stores/page-store');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

// Include components
var Link = require('core/templates/components/link.jsx');

var WelcomePage = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                title: 'Bienvenue sur Miit',
                home:  'Retour à l\'accueil'
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
                        Découvrez les nombreuses posssibilités de pérsonnalisation qui s{"'"}offrent à vous.
                    </h3>

                    <p className="mt20">
                        Pour commencer rapidement à communiquer vous pouvez choisir un modèle de Miit.
                    </p>
                    <div className="row mt20">
                        <div className="col-md-4 col-lg-4 mb20">
                            <div className="panel small">
                                <h2 className="panel-title">Conférences</h2>
                                <div className="panel-content">
                                    <p></p>
                                    <span>Applications:</span>
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
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 mb20">
                            <div className="panel small">
                                <h2 className="panel-title">Réunion</h2>
                                <div className="panel-content">
                                    <p></p>
                                    <span>Applications:</span>
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
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 mb20">
                            <div className="panel small">
                                <h2 className="panel-title">Equipe</h2>
                                <div className="panel-content">
                                    <p></p>
                                    <span>Applications:</span>
                                    <div>
                                        <span className="miit-app-icon">
                                            <i className="fa fa-comments-o bg-blue"></i>
                                        </span>
                                        <span className="miit-app-icon">
                                            <i className="fa fa-folder-open-o bg-red"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p>
                        <b>Ou</b> créer un éspace pesonnalisé en ajoutant vous même des applications.
                    </p>
                </div>
            </Layout>
        );
    }
});

PageStore.registerMainPage('welcome', WelcomePage);

module.exports = WelcomePage;