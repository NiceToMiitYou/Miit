'use strict';

// Include requirements
var UploadStore = require('core/stores/upload-store');

var UploadListItem = React.createClass({
    getDefaultProps: function() {
        return {
            upload: {}
        };
    },

    componentDidMount: function() {
        UploadStore.addProgressListener(this._onChange);
    },

    componentWillUnmount: function() {
        UploadStore.removeProgressListener(this._onChange);
    },

    _onChange: function(id) {
        if(this.isMounted() && this.props.upload.id === id) {
            this.forceUpdate();
        }
    },

    render: function() {
        var upload   = this.props.upload,
            progress = UploadStore.getProgress(upload.id);

        return (
            <div className="miit-component upload-list-item">
                <div>{upload.name}</div>
                <div>{progress + '%'}</div>
            </div>
        );
    }
});

module.exports = UploadListItem;