'use strict';

// Include requirements
var UploadStore = require('core/stores/upload-store');

// Include common
var If = require('templates/if.jsx');

// Include components
var UploadListItem = require('./upload-list-item.jsx');

var UploadList = React.createClass({
    getDefaultProps: function() {
        return {
            application: ''
        };
    },

    componentDidMount: function() {
        UploadStore.addNewListener(this._onChange);
        UploadStore.addFinishedListener(this._onChange);
    },

    componentWillUnmount: function() {
        UploadStore.removeNewListener(this._onChange);
        UploadStore.removeFinishedListener(this._onChange);
    },

    _onChange: function() {
        if(this.isMounted()) {
            this.forceUpdate();
        }
    },

    render: function() {
        var uploads = UploadStore.getUploads(this.props.application);

        return (
            <div className="miit-component upload-list">
                {uploads.map(function(upload) {
                    return <UploadListItem key={upload.id} upload={upload} />;
                }, this)}
            </div>
        );
    }
});

module.exports = UploadList;