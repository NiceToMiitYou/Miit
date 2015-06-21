(function(){
    MiitComponents.MiitNotFound = React.createClass({displayName: "MiitNotFound",
        getDefaultProps: function () {
            return {
                title: 'Cette page n\'existe pas.',
                text: {
                    home: 'Retour à l\'accueil'
                }
            };
        },

        render: function() {
            return (
                React.createElement("div", {className: "container-fluid"}, 
                    React.createElement("h1", {className: "pt25"}, this.props.title), 

                    React.createElement("div", {className: "mt50"}, 
                        React.createElement(Link, {href: "/"}, this.props.text.home)
                    )
                )
            );
        }
    });

    MiitApp
        .get('miit-page-store')
        .registerMainPage('not-found', (React.createElement(MiitComponents.MiitNotFound, null)));
})();
//# sourceMappingURL=../../team/page/miit-not-found.js.map