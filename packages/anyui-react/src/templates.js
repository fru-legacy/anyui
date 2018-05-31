import {parseText, parseCode} from './transpile';

function renderChildren(React, variables, children) {
    if (!children) return (x) => []; 
    var renderers = children.map(c => renderJson(React, variables, c));
    return (x) => renderers.map(r => r(x));
}

function renderTagName(variables, name) {
    if (name[0] === name[0].toUpperCase()) {
        return parseCode(variables, name);
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

// Attributes can extend the scope, change definitions and influence child rendering
// This considers the attributes:
// if="exp"
// repeat="exp" 
// repeat-item="name"
// define-{name}="exp"
function renderAttributes(variables, attributes) {

    var scopeTransforms = [];

    for(var define of getPropsByPrefix('define-', attributes)) {
        let transform = parseCode(variables, define.value);

        added = extendAdded(variables, added, define.key);
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

    return {extendedVars: [], scopeTransform, childrenTransform};
}

// Renders properties considering the following attributes:
// props="exp"
// prop-{name}="exp"
// All other static attributes
function renderProps(variables, attributes) {
    return (x) => {};
}

export function renderJson(React, variables, json) {
    if (json.type === 'element') {

        let tag = renderTagName(variables, json.name);
        let {extendedVars, scopeTransform, childrenTransform} = renderAttributes(variables, json.attributes);

        let props = renderProps(extendedVars, json.attributes);
        let children = renderChildren(React, extendedVars, json.children);

        return (x) => {
            var xdash = scopeTransform(x);
            var cdash = childrenTransform(xdash, children);
            return React.createElement(tag(x), props(xdash), ...cdash);
        };
    } else if (json.type === 'text') {
        return parseText(variables, json.value);
    }
}