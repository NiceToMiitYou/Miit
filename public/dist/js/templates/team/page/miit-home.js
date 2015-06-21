(function(){
    MiitComponents.MiitHome = React.createClass({displayName: "MiitHome",
        getDefaultProps: function () {
            return {
                title: 'Welcome',
                text: {
                    users: 'Utilisateurs'
                }
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

                    React.createElement("div", {className: "sidr-right"}, 
                        React.createElement("span", {className: "sr-label"}, this.props.text.users), 
                        React.createElement(MiitComponents.UserList, {headers: false, invite: false, roles: false, emails: false, filtered: false, status: true})
                    )
                )
            );
        }
    });

    MiitApp
        .get('miit-page-store')
        .registerMainPage('home', (React.createElement(MiitComponents.MiitHome, null)));
})();
//# sourceMappingURL=../../team/page/miit-home.js.map