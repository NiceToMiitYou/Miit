'use strict';

// Include core requirements
var UploadStore   = MiitApp.require('core/stores/upload-store'),
    UploadActions = MiitApp.require('core/actions/upload-actions');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var DocumentsUpload = React.createClass({
    UploadToken: null,

    getDefaultProps: function () {
        return {
            text: {
                upload: 'Envoyez',
                file:   'Envoyer un fichier'
            },
            application: ''
        };
    },

    getInitialState: function () {
        return {
            error_file: false,
            drag_over:  false,
            files:      []
        };
    },

    componentDidMount: function() {
        UploadStore.addCreatedListener(this._sendFile);
    },

    componentWillUnmount: function() {
        UploadStore.removeCreatedListener(this._sendFile);
    },

    handleSubmit: function(e) {
        if(e) {
            e.preventDefault();
        }

        this.UploadToken = UploadActions.create(this.props.application);
    },

    _sendFile: function(token, upload) {

        if(token === this.UploadToken) {
            // reset errors
            this.setState({
                error_file: false
            });

            // Get the node
            var el = React.findDOMNode(this);

            if(!el) {
                return;
            }

            // Get the form
            var result = UploadActions.upload(el.children[0], this.props.application, upload);

            if(false === result) {
                this.setState({
                    error_file: true
                });
                return;
            }

            this.setState({
                files: []
            });
        }
    },

    _onChange: function(e) {
        var files = e.target.files;

        this.setState({
            files: files
        });

        if(files && 0 !== files.length) {
            this.handleSubmit();
        }
    },

    _onDragOver: function() {
        this.setState({
            drag_over: true
        });
    },

    _onDragLeave: function() {
        this.setState({
            drag_over: false
        });
    },

    render: function() {
        var error    = this.state.error_file,
            dragOver = this.state.drag_over,
            filename = this.props.text.file;

        if(this.state.files && 0 !== this.state.files.length) {
            filename = this.state.files[0].name;
        } 

        var classesInput   = classNames('input', (error) ? 'invalid' : ''),
            classesBtnFile = classNames('btn-file', (dragOver) ? 'hover' : '');

        return (
            <div className="miit-component documents-upload mt30">
                <form method="post" encType="multipart/form-data" action="/upload" onSubmit={this.handleSubmit}>
                    <div className="center">
                        <span className={classesBtnFile} onDragOver={this._onDragOver} onDragLeave={this._onDragLeave}  onDrop={this._onDragLeave} >
                            <i className="fa fa-upload"></i>
                            {filename} 
                            <input  type="file" name="document" className={classesInput} onChange={this._onChange} />
                        </span>
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = DocumentsUpload;
