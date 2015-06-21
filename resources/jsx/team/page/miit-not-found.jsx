(function(){
    MiitComponents.MiitNotFound = React.createClass({
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
                <div className="container-fluid">
                    <h1 className="pt25">{this.props.title}</h1>

                    <div className="mt50">
                        <Link href="/">{this.props.text.home}</Link>
                    </div>
                </div>
            );
        }
    });

    MiitApp
        .get('miit-page-store')
        .registerMainPage('not-found', (<MiitComponents.MiitNotFound />));
})();