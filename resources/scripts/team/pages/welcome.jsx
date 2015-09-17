'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    TeamStore   = require('core/stores/team-store'),
    TeamActions = require('core/actions/team-actions'),
    PageStore   = require('core/stores/page-store');

// Include Layout
var Layout = require('./layouts/default-layout.jsx');

// Include components
var TemplateItem = require('core/templates/welcome/template-item.jsx'),
    AppStoreList = require('core/templates/app-store/app-store-list.jsx');

var WelcomePage = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                title:     'Bienvenue sur Miit',
                home:      'Retour à l\'accueil',
                subtitle:  'Découvrez les nombreuses posssibilités de personnalisation qui s\'offrent à vous.',
                templates: 'Pour commencer rapidement à communiquer vous pouvez choisir un modèle de Miit.',
                customs:   'Créer un espace pesonnalisé en ajoutant vous même des applications.',
                or:        'Ou'
            },
            templates: [
                {
                    id: 1,
                    title:       'Conférences',
                    description: 'Construisez un espace de communication pour les conférences avec un chat, des questionnaires et mur de questions.',
                    apps: [
                        'APP_CHAT',
                        'APP_QUIZ',
                        'APP_WALL'
                    ]
                },
                {
                    id: 2,
                    title:       'Réunion',
                    description: 'Construisez un espace pour simplifier vos réunions grace à un chat, un partage de documents et un mur de questions.',
                    apps: [
                        'APP_CHAT',
                        'APP_DOCUMENTS',
                        'APP_WALL'
                    ]
                },
                {
                    id: 3,
                    title:       'Equipe',
                    description: 'Gardez le contact et echanger facilement avec votre/vos equipe(s) avec un simple chat et un partage de documents.',
                    apps: [
                        'APP_CHAT',
                        'APP_DOCUMENTS'
                    ]
                }
            ]
        };
    },

    render: function() {
        var templates = this.props.templates;

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
                        {templates.map(function(template) {

                            return (
                                <TemplateItem key={'welcome-template-item-' + template.id} template={template} />
                            );
                        })}
                    </div>

                    <p className="text-seperator mb20 mt20">
                        {this.props.text.or}
                    </p>

                    <p className="mb20 mt20">
                        {this.props.text.customs}
                    </p>

                    <AppStoreList />
                </div>
            </Layout>
        );
    }
});

PageStore.registerMainPage('welcome', WelcomePage);

module.exports = WelcomePage;