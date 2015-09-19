'use strict';

var TextParser = React.createClass({
    KeyCounter: 0,

    MatchString: 'TEXT_PARSER_MATCH',

    Matchings: {
        'url':   /(((https?):\/\/)(%[0-9A-Fa-f]{2}|[-()_.!~*';\/?:@&=+$,A-Za-z0-9])+)([).!';\/?:,][[:blank:]])?/,
        'email': /[a-zA-Z0-9+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}/
    },

    propTypes: {
        component:  React.PropTypes.any,
        properties: React.PropTypes.object
    },

    getDefaultProps: function () {
        var matchString = this.MatchString;

        return {
            component: 'a',
            properties: {
                href:   matchString,
                target: '_blank'
            },
            text: ''  
        };
    },

    getUniqueKey: function() {
        return 'text-parser-key-' + this.KeyCounter++;
    },

    formatLink: function(match) {
        var result = '';

        switch(match.type) {
            case 'url':
                result = match.text;
                break;

            case 'email':
                result = 'mailto:' + match.text;
                break; 
        }

        return result;
    },

    match: function(text) {
        for(var type in this.Matchings) {
            var regex = this.Matchings[type];

            // Look for the matching
            var index = text.search(regex);

            // No match, skip next
            if(-1 === index) {
                continue;
            }

            // Get the text matching
            var str = text.match(regex)[0];

            return {
                index:  index,
                length: str.length,
                type:   type,
                text:   str
            };
        }

        return false;
    },

    parseTextHelper: function(text, elements) {
        if(!text) {
            return;
        }

        var match = this.match(text);

        // If no match, add text stop
        if(false === match) {
            elements.push(text);
            return;
        }

        // On match add previous part of the text
        if(0 !== match.index) {
            var previous = text.substring(0, match.index);

            // Parse previous text to be sure that we have all elements
            this.parseTextHelper(previous, elements);
        }

        // Prepare props of element
        var props = {
            key: this.getUniqueKey()
        };

        // Be sure that the a component has an href
        if('a' === this.props.component) {
            this.props.properties['href']   = this.MatchString;

            if('email' !== match.type) {
                this.props.properties['target'] = '_blank';
            }
            else
            {
                delete this.props.properties['target'];
            }
        }
        
        // Add properties pass in attributes
        for(var key in this.props.properties) {
            // Store value of property
            var value = this.props.properties[key];

            // Replace MatchString by the link
            if(this.MatchString === value) {
                value = this.formatLink(match);
            }

            // Store the props
            props[key] = value;
        }

        // Create the react element
        var element = React.createElement(this.props.component, props, match.text);

        // Generate the element
        elements.push(element);

        // Compute offset
        var offset = match.index + match.length;

        // Parse next text to get others elements
        this.parseTextHelper(text.substring(offset), elements);
    },

    parseText: function(text) {
        var elements = [];

        this.parseTextHelper(text, elements);

        return (elements.length === 1) ? elements[0] : elements;
    },

    render: function () {
        var children = this.parseText(this.props.text);

        return (
            <span>{children}</span>
        );
    }
});

module.exports = TextParser;