(function(){
    var Utils, TeamActions, TeamStore;

    MiitComponents.TeamUpdate = React.createClass({
        getDefaultProps: function() {
            return {
                placeholder: {
                    name: "Nom de l'équipe"
                },
                text: {
                    public:    'Publique',
                    isPublic:  'Votre Miit est publique et accessible a tout le monde via l\'URL suivante',
                    private:   'Privé',
                    isPrivate: 'Votre Miit est privé et ne sera accessible qu\'aux personnes de votre choix'
                },
                submit: "Modifier"
            };
        },

        getInitialState: function() {
            var initial = this.getDefaultErrors();

            initial.value_name = '';

            return initial;
        },

        getDefaultErrors: function() {
            return {
                missing_name:   false,
                invalid_same:   false,
                invalid_format: false
            };
        },
        
        componentWillMount: function() {
            if(!Utils) {
                Utils = MiitApp.get('miit-utils');
            }
            if(!TeamStore) {
                TeamStore = MiitApp.get('miit-team-store');
            }
            if(!TeamActions) {
                TeamActions = MiitApp.get('miit-team-actions');
            }
            // First define the user name
            var team  = TeamStore.getTeam();

            this.setState({
                value_name:   team.name,
                value_public: team.public
            });
        },

        componentDidMount: function() {
            TeamStore.addTeamUpdatedListener(this._onChanged);
            TeamStore.addTeamNotUpdatedListener(this._onError);
        },

        componentWillUnmount: function() {
            TeamStore.removeTeamUpdatedListener(this._onChanged);
            TeamStore.removeTeamNotUpdatedListener(this._onError);
        },

        _onChanged: function() {
            if(this.isMounted()) {
                // Be sure that is set
                var team  = TeamStore.getTeam();

                this.setState({
                    value_name:   team.name,
                    value_public: team.public
                });
            }
        },

        _onError: function() {
            console.log('team not updated.');
        },
        
        handleChange: function(e) {
            if(e.target && e.target.name) {
                var update = {};
                var name   = 'value_' + e.target.name;
                var value  = e.target.value || '';

                update[name] = value;

                this.setState(update);
            }
        },
        
        handlePublic: function(value) {
            this.setState({
                value_public: value
            });
        },

        generateUrl: function() {
            return window.location.protocol + '//' + window.location.hostname + '/';
        },

        handleSubmit: function(e) {
            e.preventDefault();

            var name   = this.state.value_name;
            var publix = this.state.value_public;
            var team   = TeamStore.getTeam();
            
            this.setState(this.getDefaultErrors());

            // Check if there is data
            if (!name) {
                this.setState({
                    missing_name: !name
                });
                return;
            }

            // Check if the old is the same as the old
            if(publix === team.public && name === team.name) {
                this.setState({
                    invalid_same: true
                });
                return;
            }

            // Check if this is a correct format
            if(!Utils.validator.team(name)) {
                this.setState({
                    invalid_format: true
                });
                return;
            }

            TeamActions.update(name, publix);

            return;
        },

        render: function() {
            var value_name   = this.state.value_name;
            var classes_name = classNames({
                'invalid': this.state.missing_name ||
                           this.state.invalid_same ||
                           this.state.invalid_format
            });

            var value_public = this.state.value_public;

            return (
                <form className="miit-component user-update" onSubmit={this.handleSubmit}>
                    <div className="mb20">
                        <input type="text" className={classes_name} value={value_name} placeholder={this.props.placeholder.name} onChange={this.handleChange} name="name" />           
                    </div>

                    <div className="checkbox-field mb20">
                        <label>
                            <input type="radio" name="confid" className="option-input radio" defaultChecked={value_public} onChange={this.handlePublic.bind(this, true)} />
                            {this.props.text.public}
                        </label>
                        <label className="ml40">
                            <input type="radio" name="confid" className="option-input radio" defaultChecked={!value_public} onChange={this.handlePublic.bind(this, false)}/>
                            {this.props.text.private}
                        </label>
                    </div>

                    <If test={value_public}>
                        <div className="mb20">
                            <p className="mb10">{this.props.text.isPublic}</p>
                            
                            <div className="col8 col16-md">
                                <div className="input-field left-icon">
                                    <i className="fa fa-link"></i>
                                    <input value={this.generateUrl()} type="text" disabled />
                                </div>
                            </div>
                        </div>
                    </If>

                    <If test={!value_public}>
                        <p className="mb10">{this.props.text.isPrivate}</p>
                    </If>

                    <div>
                        <button type="submit" className="btn btn-info mt20">
                            {this.props.submit}
                        </button>
                    </div>
                </form>
            );
        }
    });
})();