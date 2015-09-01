'use strict';

// Include core lib
var Router = MiitApp.require('core/lib/router');

// Include core requirements
var PageStore    = MiitApp.require('core/stores/page-store'),
    UserStore    = MiitApp.require('core/stores/user-store'),
    ModalActions = MiitApp.require('core/actions/modal-actions');

// Include requirements
var QuizActions = require('quiz-actions'),
    QuizStore   = require('quiz-store');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var QuizCreate = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                name:        'Nom',
                description: 'Description',
                loading:     'Loading',
                submit:      'Créer'
            }  
        };
    },

    getInitialState: function () {
        return {
            value_name:        '',
            value_description: '',
            error_name:        false,
            processing:        false
        };
    },

    componentDidMount: function() {
        QuizStore.addQuizCreatedListener(this._onCreated);
    },

    componentWillUnmount: function() {
        QuizStore.removeQuizCreatedListener(this._onCreated);
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

    handleSubmit: function(e) {
        e.preventDefault();

        if(false === UserStore.isAdmin()) {
            return;
        }

        // Reset error
        this.setState({
            error_name: false,
            processing: false
        });

        // Get values
        var name        = this.state.value_name,
            description = this.state.value_description;

        // Check the name
        if(!name || !name.trim()) {
            this.setState({
                error_name: true
            });
            return;
        }

        // Create the quiz
        var result = QuizActions.create(name, description);

        this.setState({
            processing: result
        });
    },

    _onCreated: function(quizId) {

        // Set the route as quiz update
        Router.setRoute('/quiz/update/' + quizId);

        // Close the modal
        ModalActions.close('quiz-create-new');
    },

    render: function() {
        if(false === UserStore.isAdmin()) {
            return null;
        }

        // Get values
        var value_name        = this.state.value_name,
            value_description = this.state.value_description;

        // Get errors
        var classesName = classNames(this.state.error_name ? 'invalid' : '');

        // Is processing
        var processing = this.state.processing;

        return (
            <div className="miit-component quiz-create">
                <form onSubmit={this.handleSubmit}>
                    <label className="input-field">
                        {this.props.text.name}
                        <input type="text" name="name" value={value_name} onChange={this.handleChange} className={classesName}/>
                    </label>
                    <label className="mt20 input-field">
                        {this.props.text.description}
                        <textarea name="description" onChange={this.handleChange} defaultValue={value_description}></textarea>
                    </label>
                    <div className="modal-footer right">
                         <button type="submit" className="btn-info btn btn-lg">{this.props.text.submit}</button>
                    </div>
                </form>
                <If test={processing}>
                    <div className="overlay">
                        <div className="loading"><i className="spin fa fa-spin icon-logo-miit"></i> {this.props.text.loading}</div>
                    </div>
                </If>
            </div>
        );
    }
});

module.exports = QuizCreate;
