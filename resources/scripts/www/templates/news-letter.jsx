'use strict';

// Load Home Request
var HomeRequest = require('core/requests/home-request');

// Include common
var If = require('templates/if.jsx');

var MiitTranslations = global.MiitTranslations;

var NewsLetter = React.createClass({
    getDefaultProps: function() {
        return {
            placeholder: {
                email: MiitTranslations['input.your.email'],
            },
            submit:       MiitTranslations['www.subscribe.newsletter'],
            submit_short: MiitTranslations['www.subscribe.newsletter_short'],
            variant: false
        };
    },

    getInitialState: function() {
        var state =  this.getDefaultErrors();

        state.done = false;

        return state;
    },

    getDefaultErrors: function() {
        return {
            missing_email: false,
            invalid_email: false
        };
    },

    handleSubmit: function(e) {
        e.preventDefault();

        var email = React.findDOMNode(this.refs.email).value.trim();

        this.setState(this.getDefaultErrors());

        // Check if there is data
        if (!email) {
            this.setState({
                missing_email: !email
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

        HomeRequest.newsletter(email, function(data) {
            if(data.done) {
                this.setState({
                    done: true
                });
            }
        }.bind(this));

        return;
    },

    render: function() {
        var classes_email = classNames({
            'invalid': this.state.missing_email ||
                       this.state.invalid_email
        });

        var done    = this.state.done;
        var submit  = (false === this.props.variant) ? this.props.submit :
                                                       this.props.submit_short;
        var classes = classNames('btn', (false === this.props.variant) ? 'btn-info' : 'btn-dark' ,'pl10 pr10 pt15 pb15');

        return (
            <form className="miit-component news-letter" onSubmit={this.handleSubmit}>
                <If test={!done}>
                    <div className="row pt30">
                        <div className="col-md-8 mb10">
                            <div className={classes_email + " input-field bg-transparent left-icon icon-transparent push0 pt5 pb5" }>
                                <i className="fa fa-envelope-o pt5 pl5 pb5"></i>
                                <input type="text" placeholder={this.props.placeholder.email} ref="email" />
                            </div>
                        </div>
                        <div className="col-md-4 mb10">
                            <button type="submit" className={classes}>{submit}</button>
                        </div>
                    </div>
                </If>
                <If test={done}>
                    <div className="mt30">Merci beaucoup pour votre confiance.</div>
                </If>
            </form>
        );
    }
});

module.exports = NewsLetter;