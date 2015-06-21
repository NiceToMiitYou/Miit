(function(){
    var UserStore, UserActions;

    MiitComponents.MenuTeam = React.createClass({displayName: "MenuTeam",
        getDefaultProps: function () {
            return {
                text: {
                    user_label: 'Utilisateur',
                    my_account: 'Mon compte',
                    disconnect: 'Déconnexion',
                    connect:    'Connexion',
                    apps_label: 'Applications'
                }
            };
        },

        componentWillMount: function() {
            // Get the user store
            if(!UserStore) {
                UserStore = MiitApp.get('miit-user-store');
            }
            // Get the user actions
            if(!UserActions) {
                UserActions = MiitApp.get('miit-user-actions');
            }
        },

        render: function() {
            return (
                React.createElement("div", {className: "sidr-left bg-blue-grey"}, 
                    React.createElement("div", {className: "sl-wrapper"}, 
                        React.createElement(MiitComponents.MenuHeader, null), 
                        
                        React.createElement(MiitComponents.MenuLabel, {label: this.props.text.user_label}), 
                        React.createElement(MiitComponents.MenuUserProfile, null), 

                        React.createElement("ul", {className: "sl-list mb10"}, 
                            React.createElement(If, {test: !UserStore.isAnonym()}, 
                                React.createElement("li", null, 
                                    React.createElement(Link, {href: "#/me", activeGroup: "menu-team", activeName: "me"}, 
                                        React.createElement("i", {className: "fa fa-cogs pull-left"}), " ", this.props.text.my_account
                                    )
                                )
                            ), 
                            React.createElement(If, {test: !UserStore.isAnonym()}, 
                                React.createElement("li", null, 
                                    React.createElement(Link, {href: "#/logout", onLinkClick: UserActions.logout}, 
                                        React.createElement("i", {className: "fa fa-sign-out pull-left"}), " ", this.props.text.disconnect
                                    )
                                )
                            ), 
                            React.createElement(If, {test: UserStore.isAnonym()}, 
                                React.createElement("li", null, 
                                    React.createElement(Link, {href: "#/login"}, 
                                        React.createElement("i", {className: "fa fa-sign-in pull-left"}), " ", this.props.text.connect
                                    )
                                )
                            )
                        ), 

                        React.createElement(MiitComponents.MenuLabel, {label: this.props.text.apps_label}), 
                        
                        React.createElement("ul", {className: "sl-list"}, 
                            React.createElement("li", null, 
                                React.createElement(Link, {href: "#/home", activeGroup: "menu-team", activeName: "home"}, 
                                    React.createElement("i", {className: "fa fa-weixin pull-left"}), " Chat", 
                                    React.createElement("span", {className: "notification"}, "4")
                                )
                            ), 
                            React.createElement("li", null, 
                                React.createElement(Link, {href: "#/quizz", activeGroup: "menu-team", activeName: "quizz"}, 
                                    React.createElement("i", {className: "fa fa-question pull-left"}), " Quizz"
                                )
                            ), 
                            React.createElement("li", null, 
                                React.createElement(Link, {href: "#/test2/plop"}, 
                                    React.createElement("i", {className: "fa fa-folder-o pull-left"}), " Documents", 
                                    React.createElement("span", {className: "notification"}, "18")
                                )
                            ), 
                            React.createElement(If, {test: UserStore.isAdmin()}, 
                                React.createElement("li", null, 
                                    React.createElement(Link, {href: "/test2/plop"}, 
                                        React.createElement("i", {className: "fa fa-plus pull-left"}), " Ajouter une App"
                                    )
                                )
                            )
                        )

                    )
                )
            );
        }
    });
})();
//# sourceMappingURL=../../../team/component/menu/menu-team.js.map