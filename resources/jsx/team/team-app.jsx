(function(){
    var Router, UserStore, UserActions, PageStore, PageActions;

    var defaultPage = 'home';

    MiitComponents.TeamApp = React.createClass({
        getInitialState: function() {
            return {
                page: null
            };
        },

        componentWillMount: function() {
            // Get the user actions
            if(!UserStore) {
                UserStore = MiitApp.get('miit-user-store');
            }
            // Get the user actions
            if(!UserActions) {
                UserActions = MiitApp.get('miit-user-actions');
                UserActions.check(UserStore.getToken());
            }
            // Get the page store
            if(!PageStore) {
                PageStore = MiitApp.get('miit-page-store');
            }
            // Get the page actions
            if(!PageActions) {
                PageActions = MiitApp.get('miit-page-actions');
            }
            // Get the router and handle page change
            if(!Router) {
                Router = MiitApp.get('miit-router');
                Router.routes.set('/([a-zA-Z0-9_\-]{0,})', function(mainPage) {
                    var page = mainPage || defaultPage;

                    // Set the current active page of the menu
                    ActiveGroups['menu-team'] = page;

                    // Set the current active page          
                    PageActions.changeMainPage(page);
                });
            }
        },

        componentDidMount: function() {
            UserStore.addLoggedInListener(this._onChange);
            PageStore.addMainPageChangedListener(this._onChange);
        },

        componentWillUnmount: function() {
            UserStore.removeLoggedInListener(this._onChange);
            PageStore.removeMainPageChangedListener(this._onChange);
        },

        _onChange: function() {
            var page = PageStore.getCurrentMainPage();

            if(!page)
            {
                setTimeout(function(){
                    PageActions.changeMainPage('not-found');
                });
            }
            else if(this.isMounted())
            {
                this.setState({
                    page: page
                });
            }
        },

        render: function() {
            return (
                <div className="page bg-grey lighten-5">
                    <MiitComponents.MenuTeam />

                    <div className="main">
                        {this.state.page}
                    </div>

                    <MiitComponents.NotificationsContainer />
                </div>
            );
        }
    });
})();