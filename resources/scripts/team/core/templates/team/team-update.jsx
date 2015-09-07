'use strict';

// Include requirements
var UserStore            = require('core/stores/user-store'),
    TeamStore            = require('core/stores/team-store'),
    NotificationsActions = require('core/actions/notifications-actions'),
    TeamActions          = require('core/actions/team-actions');

// Include common
var If = require('templates/if.jsx');

var TeamUpdate = React.createClass({
    getDefaultProps: function() {
        return {
            placeholder: {
                name: 'Nom du Miit'
            },
            text: {
                public:             'Public',
                isPublic:           'Votre Miit est public et accessible à tout le monde via l\'URL suivante',
                private:            'Privé',
                name:               'Nom de votre Miit', 
                privacy:            'Confidentialité', 
                changeInformations: 'Les informations de votre Miit ont bien été modifiées', 
                changeApplications: 'Les applications de votre Miit ont bien été modifiées', 
                isPrivate:          'Votre Miit est privé et ne sera accessible qu\'aux personnes de votre choix'
            },
            submit: 'Sauvegarder'
        };
    },

    getInitialState: function() {
        var initial = this.getDefaultErrors();

        initial.value_name   = '';
        initial.value_public = '';

        return initial;
    },

    componentWillMount: function() {
        // Get the team
        var team = TeamStore.getTeam();

        // Reset value
        this.setState({
            value_name:   team.name,
            value_public: team.public
        });
    },

    getDefaultErrors: function() {
        return {
            missing_name:   false,
            invalid_same:   false,
            invalid_format: false
        };
    },
    
    componentDidMount: function() {
        TeamStore.addTeamUpdatedListener(this._onChanged);
    },

    componentWillUnmount: function() {
        TeamStore.removeTeamUpdatedListener(this._onChanged);
    },

    _onChanged: function(changeAction) {
        if(this.isMounted()) {
            // Be sure that is set
            var team = TeamStore.getTeam();

            if ('TEAM' === changeAction) {

                NotificationsActions.notify('success', this.props.text.changeInformations);

            } else if ('APPLICATIONS' === changeAction) {

                NotificationsActions.notify('success', this.props.text.changeApplications);

            }

            this.setState({
                value_name:   team.name,
                value_public: team.public
            });
        }
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

        if(false === UserStore.isAdmin()) {
            return;
        }

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
        if(!MiitUtils.validator.team(name)) {
            this.setState({
                invalid_format: true
            });
            return;
        }

        TeamActions.update(name, publix);

        return;
    },

    render: function() {
        if(false === UserStore.isAdmin()) {
            return null;
        }

        var value_name   = this.state.value_name;
        var classes_name = classNames({
            'invalid': this.state.missing_name ||
                       this.state.invalid_same ||
                       this.state.invalid_format
        });

        var value_public = this.state.value_public;

        return (
            <form className="miit-component user-update" onSubmit={this.handleSubmit}>

                <h3 className="mb20">{this.props.text.name}</h3>

                <div className="mb20">
                    <input type="text" className={classes_name} value={value_name} placeholder={this.props.placeholder.name} onChange={this.handleChange} name="name" />           
                </div>

                <h3 className="mb20 mt30">{this.props.text.privacy}</h3>

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
                        
                        <div>
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
                    <button type="submit" className="btn btn-success mt10">
                        <i className="fa fa-save mr5"></i> {this.props.submit}
                    </button>
                </div>
            </form>
        );
    }
});

module.exports = TeamUpdate;