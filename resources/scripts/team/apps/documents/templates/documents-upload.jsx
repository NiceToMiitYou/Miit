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
                upload: 'Envoyez'
            },
            upload:      '',
            application: ''
        };
    },

    getInitialState: function () {
        return {
            error_file: false  
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

    render: function() {
        var error = this.state.error_file;

        var classesInput = classNames('input', (error) ? 'invalid' : '');

        return (
            <div className="miit-component documents-upload">
                <form method="post" encType="multipart/form-data" action="/upload" onSubmit={this.handleSubmit}>
                    <input  type="file" name="document" className={classesInput} />

                    <button type="submit">{this.props.text.upload}</button>
                </form>
            </div>
        );
    }
});

module.exports = DocumentsUpload;
