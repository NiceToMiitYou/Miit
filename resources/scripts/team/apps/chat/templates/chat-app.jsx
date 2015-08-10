'use strict';

// Include core requierments
var PageStore = MiitApp.require('core/stores/page-store');

// Include requirements
var ChatStore   = require('chat-store'),
    ChatActions = require('chat-actions');

// Include components
var ChatRoom = require('templates/chat-room.jsx');

var ChatApp = React.createClass({
    getInitialState: function () {
        return {
            page: null
        };
    },

    componentDidMount: function() {
        PageStore.addPageChangedListener(this._onChange);
        this._onChange();
    },

    componentWillUnmount: function() {
        PageStore.removePageChangedListener(this._onChange);
    },

    _onChange: function() {
        if(this.isMounted()) {
            var page = PageStore.getCurrentApplicationPage();

            this.setState({
                page: page || ChatRoom
            });
        }
    },

    render: function() {
        var Page = this.state.page;

        if(null === Page) {
            return null;
        }

        return (
            <div className="miit-component chat-app fullheight">
                <Page ref="page" />
            </div>
        );
    }
});

module.exports = ChatApp;
