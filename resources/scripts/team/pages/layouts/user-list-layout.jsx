'use strict';

// Include components
var Clock = require('templates/clock.jsx');

// Include components
var UserList = require('core/templates/user/user-list.jsx');

var DefaultLayout = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                users: 'Utilisateurs'
            }  
        };
    },

    render: function() {
        return (
            <div className="user-list fullheight">
                <div className="page-header">
                    <a href="#" className="minimize-menu">
                        <i className="fa fa-bars"></i>
                    </a>
                    <h1>{this.props.title}</h1>
                    <Clock />
                </div>

                {this.props.children}

                <div className="sidr-right">
                    <span className="sr-label">{this.props.text.users}</span>
                    <UserList headers={false} invite={false} roles={false} emails={false} filtered={false} status={true} />
                </div>
            </div>
        );
    }
});

module.exports = DefaultLayout;
