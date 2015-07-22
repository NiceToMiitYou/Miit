'use strict';

// Load Home Request
var HomeRequest = require('application/requests/home-request');

function getDomainName(hostName)
{
    return hostName.substring(hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1);
}

var CreateTeam = React.createClass({
    getDefaultProps: function() {
        return {
            placeholder: {
                email: 'Votre addresse mail',
                team:  'Le nom de votre équipe'
            },
            submit: 'Créer une équipe'
        };
    },

    getInitialState: function() {

        return this.getDefaultErrors();
    },

    getDefaultErrors: function() {
        return {
            missing_email: false,
            missing_team:  false,
            invalid_email: false,
            invalid_team:  false
        };
    },

    handleSubmit: function(e) {
        e.preventDefault();

        var email = React.findDOMNode(this.refs.email).value.trim();
        var team  = React.findDOMNode(this.refs.team).value.trim();

        this.setState(this.getDefaultErrors());

        // Check if there is data
        if (!email || !team) {
            this.setState({
                missing_email: !email,
                missing_team:  !team
            });
            return;
        }

        // Check if this is a correct email
        if(!MiitUtils.validator.email(email)) {
            this.setState({
                invalid_email: true
            });
            return;
        }

        // Check if this is a correct team name
        if(!MiitUtils.validator.team(team)) {
            this.setState({
                invalid_team: true
            });
            return;
        }

        HomeRequest.registration(email, team, function(data) {
            if(data.done) {
                /** Redirect the user to the team
                var scheme = window.location.protocol + '//';
                var domain = getDomainName(window.location.host);

                var url = scheme + data.slug + '.' + domain;

                window.location = url;
                */
            }   
        });

        return;
    },

    render: function() {
        var classes_email = classNames({
            'invalid': this.state.missing_email ||
                       this.state.invalid_email
        });

        var classes_team = classNames({
            'invalid':  this.state.missing_team ||
                        this.state.invalid_team
        });

        return (
            <form className="miit-component create-team" onSubmit={this.handleSubmit}>
                
                <div className="row pt20 pb20">
                    <div className="col-md-6 mb10">
                        <div className="input-field left-icon icon-transparent push0">
                            <i className="fa fa-envelope-o"></i>
                            <input type="text" className={classes_email} placeholder={this.props.placeholder.email} ref="email" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-field left-icon icon-transparent col5">
                            <i className="fa fa-users"></i>
                            <input type="text" className={classes_team}  placeholder={this.props.placeholder.team}  ref="team" />
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-dark mt5">{this.props.submit}</button>
                
            </form>
        );
    }
});

module.exports = CreateTeam;