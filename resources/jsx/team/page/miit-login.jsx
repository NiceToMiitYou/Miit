(function(){
    MiitComponents.MiitLogin = React.createClass({
        getDefaultProps: function () {
            return {
                title: 'Connexion'
            };
        },

        render: function() {
            return (
                <div className="container-fluid">
                    <div className="page-header">
                        <a href="#" className="minimize-menu">
                            <i className="fa fa-bars"></i>
                        </a>
                        <h1>{this.props.title}</h1>
                        <MiitComponents.Clock />
                    </div>

                    <MiitComponents.UserLogin />
                </div>
            );
        }
    });

    MiitApp
        .get('miit-page-store')
        .registerMainPage('login', (<MiitComponents.MiitLogin />));
})();