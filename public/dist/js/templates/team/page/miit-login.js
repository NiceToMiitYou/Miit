(function(){
    MiitComponents.MiitLogin = React.createClass({displayName: "MiitLogin",
        getDefaultProps: function () {
            return {
                title: 'Connexion'
            };
        },

        render: function() {
            return (
                React.createElement("div", {className: "container-fluid"}, 
                    React.createElement("div", {className: "page-header"}, 
                        React.createElement("a", {href: "#", className: "minimize-menu"}, 
                            React.createElement("i", {className: "fa fa-bars"})
                        ), 
                        React.createElement("h1", null, this.props.title), 
                        React.createElement(MiitComponents.Clock, null)
                    ), 

                    React.createElement(MiitComponents.UserLogin, null)
                )
            );
        }
    });

    MiitApp
        .get('miit-page-store')
        .registerMainPage('login', (React.createElement(MiitComponents.MiitLogin, null)));
})();
//# sourceMappingURL=../../team/page/miit-login.js.map