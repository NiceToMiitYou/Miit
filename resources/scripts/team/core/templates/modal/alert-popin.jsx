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
                <span>{content}</span>
                <button className="btn btn-success mr20" onClick={this._onAgree} type="button">
                    {this.props.text.agree}
                </button>
                <button className="btn btn-danger mr20" onClick={this._onCancel} type="button">
                    {this.props.text.cancel}
                </button>
            </div>
        );
    }
});

module.exports = AlertPopin;