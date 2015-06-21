(function(){
    var Utils, HomeRequest;

    MiitComponents.NewsLetter = React.createClass({displayName: "NewsLetter",
        getDefaultProps: function() {
            return {
                placeholder: {
                    email: 'Votre addresse mail'
                },
                submit: 'S\'inscrire à la Newsletter'
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

        componentWillMount: function() {
            if(!Utils) {
                Utils = MiitApp.get('miit-utils');
            }
            if(!HomeRequest) {
                HomeRequest = MiitApp.get('miit-home-request');
            }
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
            if(!Utils.validator.email(email)) {
                this.setState({
                    invalid_email: true
                });
                return;
            }

            HomeRequest.registration(email, function(data) {
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

            var done = this.state.done;

            return (
                React.createElement("form", {className: "miit-component news-letter", onSubmit: this.handleSubmit}, 
                    React.createElement(If, {test: !done}, 
                        React.createElement("div", {className: "row pt30 pb20"}, 
                            React.createElement("div", {className: "col-md-9 mb10"}, 
                                React.createElement("div", {className: classes_email + " input-field left-icon icon-transparent push0 pt5 pb5"}, 
                                    React.createElement("i", {className: "fa fa-envelope-o pt5 pl5 pb5"}), 
                                    React.createElement("input", {type: "text", placeholder: this.props.placeholder.email, ref: "email"})
                                )
                            ), 
                            React.createElement("div", {className: "col-md-3 mb10"}, 
                                React.createElement("button", {type: "submit", className: "btn btn-dark pl10 pr10 pt15 pb15"}, this.props.submit)
                            )
                        )
                    ), 
                    React.createElement(If, {test: done}, 
                        React.createElement("div", {className: "mt30"}, "Merci beaucoup pour votre confiance.")
                    )
                )
            );
        }
    });
})();
//# sourceMappingURL=../../www/component/news-letter.js.map