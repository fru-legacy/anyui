import {parseText, parseCode} from './transpile';

function renderChildren(React, scope, children) {
    if (!children) return (x) => []; 
    var renderers = children.map(c => renderJson(React, scope, c));
    return (x) => renderers.map(r => r(x));
}

function renderTagName(scope, name) {
    if (name[0] === name[0].toUpperCase()) {
        return parseCode(scope, name);
    } else {
        return (x) => name;
    }
}

function getPropsByPrefix(prefix, object) {
    let results = [];
    for(var prop in object) {
        if (prop.indexOf(prefix) === 0) {
            results.push({
                key: prop.substring(prefix.length),
                value: object[prop]
            });
        }
    }
    return results;
}

function extendAdded(scope, added, key) {

    return added;
}

// Attributes can extend the scope, change definitions and influence child rendering
// This considers the attributes:
// if="exp"
// repeat="exp" 
// repeat-item="name"
// define-{name}="exp"
function renderAttributes(scope, attributes) {
    var added = [];
    var scopeTransforms = [];

    for(var define of getPropsByPrefix('define-', attributes)) {
        let transform = parseCode(scope, define.value);
        added = extendAdded(scope, added, define.key);
        scopeTransforms.push((x) => x[define.key] = transform(x))
    }

    var childrenTransform = (x, renderChildren) => renderChildren(x);



    let scopeTransform = (x) => x;
    if (scopeTransforms.length) {
        scopeTransform = (x) => Object.assign({}, x);
        for(var transform of scopeTransforms) {
            scopeTransform = (x) => transform(scopeTransform(x))
        }
    }

    return {added, scopeTransform, childrenTransform};
}

// Renders properties considering the following attributes:
// props="exp"
// prop-{name}="exp"
// All other static attributes
function renderProps(scope, attributes) {
    return (x) => {};
}

export function renderJson(React, scope, json) {
    if (json.type === 'element') {

        let tag = renderTagName(scope, json.name);
        let {added, scopeTransform, childrenTransform} = renderAttributes(scope, json.attributes);
        var extendedScope = scope.concat(added);

        let props = renderProps(extendedScope, json.attributes);
        let children = renderChildren(React, extendedScope, json.children);

        return (x) => {
            var xdash = scopeTransform(x);
            var cdash = childrenTransform(xdash, children);
            return React.createElement(tag(x), props(xdash), ...cdash);
        };
    } else if (json.type === 'text') {
        return parseText(scope, json.value);
    }
}