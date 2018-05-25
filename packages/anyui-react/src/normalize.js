function parseXml(xmlString) {
    if (window && window.ActiveXObject) {
        let xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlString);
        return xmlDoc;
    } else {
        let parser;
        if (window && window.DOMParser) {
            parser = new window.DOMParser();
        } else {
            parser = require('xmldom').DOMParser;
        }
        return parser.parseFromString(xmlString, "text/xml");
    }
}

function xml2ObjectIterate(node) {
    if (node.nodeType === 1) {
        let result = { type: node.nodeName };
        if (node.attributes && node.attributes.length) {
            result.props = [];
            for (var i = 0; i < node.attributes.length; i++) {
                var attribute = node.attributes.item(i);
                result.props.push({
                    name: attribute.name,
                    value: attribute.value
                });
            }
        }
        if (node.childNodes && node.childNodes.length) {
            result.children = [];
            for (var i = 0; i < node.childNodes.length; i++) {
                let child = xml2ObjectIterate(node.childNodes.item(i));
                if (child) result.children.push(child);
            }
        }
        return result;
    } else if (node.nodeType === 3) {
        return node.nodeValue.trim();
    }
}

exports.xml2Object = function (xmlString) {
    let document = parseXml(xmlString), root = {};
    if (document.nodeType !== 9 || document.childNodes.length !== 1) {
        throw '';
    }
    return xml2ObjectIterate(document.childNodes.item(0));
};

function escapeXml(string) {
    string = string.replace(/&/, '&amp;');
    string = string.replace(/"/, '&quot;');
    string = string.replace(/'/, '&apos;');
    string = string.replace(/</, '&lt;');
    string = string.replace(/>/, '&gt;');
    return string;
}

function props2Xml(props) {
    if (!props || !props.length) return '';
    var attributes = [];
    for(var i = 0; i < props.length; i++) {
        attributes.push(props[i].name + '="' + escapeXml(props[i].value) + '"');
    }
    return ' ' + attributes.join(' ');
}

function object2XmlIterate(object, depth) {
    var spacing = Array(depth + 1).join('\t');
    if (typeof object === 'string') {
        return [spacing + escapeXml(object)];
    } else if (object.type) {
        var prefix = spacing + '<' + object.type + props2Xml(object.props);

        if (object.children && object.children.length) {
            let children = [];
            for(var i = 0; i < object.children.length; i++) {
                children = children.concat(object2XmlIterate(object.children[i], depth + 1));
            }
            let closing = spacing + '</' + object.type + '>';
            return [prefix + '>'].concat(children).concat([closing]);
        } else {
            return [prefix + ' />'];
        }
    }
    return [];
}

exports.object2Xml = function (object) {
    return object2XmlIterate(object, 0).join('\n');
};