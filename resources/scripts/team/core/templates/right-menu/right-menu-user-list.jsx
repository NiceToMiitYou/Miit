'use strict';

// Include requirements
var UserStore   = require('core/stores/user-store'),
    UserActions = require('core/actions/user-actions'),
    UserList    = require('core/templates/user/user-list.jsx'),
    TeamStore   = require('core/stores/team-store'),
    PageActions = require('core/actions/page-actions');

// Include common
var If = require('templates/if.jsx');

// Include components
var Link             = require('core/templates/components/link.jsx'),
    RightMenuLabel   = require('./right-menu-label.jsx'),
    RightMenuUser    = require('./right-menu-user-profile.jsx');

var RightMenuUserList = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                users:      'Utilisateurs',
                account:    'Mon compte',
                add_user:   'Ajouter un utilisateur'
            },
            tab: {
                id: 1,
                icon: 'users'
            }
        };
    },

    _onClick: function() {
        if (typeof this.props.setCurrent === 'function') {
            this.props.setCurrent(this.props.tab.id);
        };
    },

    render: function() {

        if(this.props.id !== this.props.current) {
            return null;
        }

        return (
        	<div className="miit-component right-menu-user-list">
                <RightMenuLabel icon="fa-user" label={this.props.text.account}/>
                <RightMenuUser />

                <RightMenuLabel icon="fa-users" label={this.props.text.users}/>
                
                <UserList headers={false} loader={false} invite={false} roles={false} emails={false} filtered={false} status={true} me={false} />
                
                <If test={UserStore.isAdmin()}>
                    <Link href="#/team/users" className="add-user">
                        <i className="fa fa-user-plus pull-left"></i> {this.props.text.add_user}
                    </Link>
                </If>
            </div>
        );
    }
});

module.exports = RightMenuUserList;