(function(){
    MiitComponents.MenuLabel = React.createClass({displayName: "MenuLabel",
        render: function() {
            var classes = classNames('pull-left', 'fa', this.props.icon || '');
            
            return (
                React.createElement("span", {className: "miit-component menu-label sl-label"}, 
                    React.createElement("i", {className: classes}), 
                    this.props.label
                )
            );
        }
    });
})();
//# sourceMappingURL=../../../team/component/menu/menu-label.js.map