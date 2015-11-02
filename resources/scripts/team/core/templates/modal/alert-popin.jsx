'use strict';

var AlertPopin = React.createClass({
    getDefaultProps: function () {
        return {
            text: {
                agree:  'Valider',
                cancel: 'Annuler'
            },
            content:  '',
            onAgree:  function() {},
            onCancel: function() {},
            onClick:  function() {}
        };
    },

    _onClick: function(func) {
        var onClick = this.props.onClick;
        
        if(typeof func === 'function') {
            setTimeout(func);
        }

        if(typeof onClick === 'function') {
            setTimeout(onClick);
        }
    },

    _onAgree: function() {
        this._onClick(this.props.onAgree);
    },

    _onCancel: function() {
        this._onClick(this.props.onCancel);
    },

    render: function() {
        var content = this.props.content;

        return (
            <div className="miit-component alert-popin">
                <span className="alert-message">{content}</span>
                <div className="modal-footer right">
                    <button className="btn btn-success mr15" onClick={this._onAgree} type="button">
                        <i className="fa fa-check mr5"></i> {this.props.text.agree}
                    </button>

                    <button className="btn btn-danger" onClick={this._onCancel} type="button">
                        <i className="fa fa-times mr5"></i> {this.props.text.cancel}
                    </button>
                </div>
            </div>
        );
    }
});

module.exports = AlertPopin;