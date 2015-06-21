(function(){
    var UserStore;

    MiitComponents.MiitUserSettings = React.createClass({displayName: "MiitUserSettings",
        getDefaultProps: function () {
            return {
                text: {
                    informations: 'Informations'
                }
            };
        },

        componentWillMount: function() {
            if(!UserStore) {
                UserStore = MiitApp.get('miit-user-store');
            }
        },

        componentDidMount: function() {
            UserStore.addUserUpdatedListener(this._onChange);
        },

        componentWillUnmount: function() {
            UserStore.removeUserUpdatedListener(this._onChange);
        },

        _onChange: function() {
            this.forceUpdate();
        },

        render: function() {
            if(UserStore.isAnonym()) {
                return React.createElement(MiitComponents.MiitNotFound, null);
            }

            var user = UserStore.getUser();
            var name = UserStore.getName(user);

            return (
                React.createElement("div", {className: "container-fluid"}, 
                    React.createElement("div", {className: "page-header"}, 
                        React.createElement("a", {href: "#", className: "minimize-menu"}, 
                            React.createElement("i", {className: "fa fa-bars"})
                        ), 
                        React.createElement("h1", null, name), 
                        React.createElement(MiitComponents.Clock, null)
                    ), 
                    
                    React.createElement("div", {className: "panel mt30"}, 
                        React.createElement("h2", {className: "panel-title"}, React.createElement("i", {className: "fa fa-th pull-left "}), this.props.text.informations), 
                        React.createElement("div", {className: "panel-content"}, 
                            React.createElement("div", {className: "row"}, 
                                React.createElement("div", {className: "col-md-7 mb20"}, 
                                    React.createElement("h3", {className: "mb20"}, React.createElement("i", {className: "fa fa-key pull-left"}), " Modifier vos informations"), 
                                    React.createElement(MiitComponents.UserUpdate, null)
                                ), 

                                React.createElement("div", {className: "col-md-5"}, 
                                    React.createElement("h3", {className: "mb20"}, React.createElement("i", {className: "fa fa-key pull-left"}), " Changer de mot de passe"), 
                                    React.createElement(MiitComponents.UserChangePassword, null)
                                )
                            )
                        )
                    )
                )
            );
        }
    });

    MiitApp
        .get('miit-page-store')
        .registerMainPage('me', (React.createElement(MiitComponents.MiitUserSettings, null)));
})();
//# sourceMappingURL=../../team/page/miit-user-settings.js.map