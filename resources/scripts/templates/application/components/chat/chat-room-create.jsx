'use strict';

// Include requirements
var ChatActions = require('application/actions/chat-actions'),
    UserStore   = require('application/stores/user-store');

var ChatRoomCreate = React.createClass({
    getDefaultProps: function () {
        return {
            placeholder: {
                room: 'Nom de la salle'
            },
            submit: 'Créer'
        };
    },

    getInitialState: function() {
        return {
            name: ''
        };
    },

    handleChange: function(e) {
        if(e.target) {
            // Update the message
            this.setState({
                name: e.target.value || ''
            });
        }
    },

    handleSubmit: function(e) {
        e.preventDefault();

        // Is the user an admin?
        var isAdmin = UserStore.isAdmin();

        if(!isAdmin) {
            return;
        }

        var name  = this.state.name;

        var send = ChatActions.create(name);

        // If the room is created, reset the name
        if(true === send) {
            this.setState({
                name: ''
            });
        }
    },

    render: function() {
        // Is the user an admin?
        var isAdmin = UserStore.isAdmin();

        if(!isAdmin) {
            return null;
        }

        var name = this.state.name;

        return (
            <form className="miit-component chat-room-create" onSubmit={this.handleSubmit} onClick={this.onClick}>
                <input type="text" value={name} placeholder={this.props.placeholder.name} onChange={this.handleChange} />
                <button type="submit" className="btn btn-warning">{this.props.submit}</button>
            </form>
        );
    }
});

module.exports = ChatRoomCreate;
