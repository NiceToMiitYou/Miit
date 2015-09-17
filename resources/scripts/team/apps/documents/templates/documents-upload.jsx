'use strict';

// Include core requirements
var UploadActions = MiitApp.require('core/actions/upload-actions'),
    ModalActions  = MiitApp.require('core/actions/modal-actions');

// Include common templates
var If = MiitApp.require('templates/if.jsx');

var DocumentsUpload = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                upload: 'Envoyez',
                file:   'Choisir un fichier'
            },
            upload:      '',
            application: ''
        };
    },

    getInitialState: function () {
        return {
            error_file: false,
            drag_over:  false,
            files:      ''
        };
    },

    handleSubmit: function(e) {
        e.preventDefault();

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
        var result = UploadActions.upload(el.children[0], this.props.application, this.props.upload);

        if(false === result) {
            this.setState({
                error_file: true
            });
            return;
        }

        ModalActions.close('document-upload');
    },

    _onChange: function(e) {

        var files = e.target.files;
        this.setState({
            files: files
        });
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
            <div className="miit-component documents-upload">
                <form method="post" encType="multipart/form-data" action="/upload" onSubmit={this.handleSubmit}>
                    <div className="center">
                        <span className={classesBtnFile} onDragOver={this._onDragOver} onDragLeave={this._onDragLeave}  onDrop={this._onDragLeave} >
                            {filename} 
                            <input  type="file" name="document" className={classesInput} onChange={this._onChange} />
                        </span>
                    </div>

                    <div className="modal-footer right">
                        <button type="submit" className="btn btn-info">{this.props.text.upload}</button>
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = DocumentsUpload;
