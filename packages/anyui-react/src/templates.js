import {parseText, parseCode} from './transpile';

function renderChildren(React, variables, children) {
    if (!children) return (scope) => []; 
    var renderers = children.map(c => renderJson(React, variables, c));
    return (scope) => renderers.map(r => r(scope));
}

function renderTagName(React, variables, name) {
    if (name[0] === name[0].toUpperCase()) {
        return parseCode(variables, name);
    } else if (name === 'virtual') {
        return (scope) => React.Fragment;
    } else {
        return (scope) => name;
    }
}

function getKeysByPrefix(prefix, attributes) {
    let results = [];
    for(var prop in attributes) {
        if (prop.indexOf(prefix) === 0) {
            results.push({
                key: prop.substring(prefix.length),
                value: attributes[prop]
            });
        }
    }
    return results;
}

function getAllTextAttributes(attributes) {
    let results = [];
    for(var prop in attributes) {
        if (prop === 'if' || prop === 'repeat' || prop === 'repeat-item') continue;
        if (prop === 'props') continue;
        if (prop === 'style' || prop === 'class' || prop === 'className') continue;
        if (prop.indexOf('define-') === 0 || prop.indexOf('prop-') === 0) continue;
        results.push({key: prop, value: attributes[prop]});
    }
    return results;
}

function combineTransformers(transforms) {
    if (!transforms.length) return (scope) => scope;
    return (scope) => {
        let result = Object.assign({}, scope);
        for(var transform of transforms) {
            result[transform.key] = transform.code(scope);
        }
        return result;
    };
}

function extendVariables(variables, added) {
    if (!added.length) return variables;
    let extended = variables.slice();
    for(let key of added) {
        if (variables.indexOf(key) === -1) extended.push(key);
    }
    return extended;
}

// Attributes can extend the scope, change definitions and influence child rendering
// This considers the attributes:
// if="exp"
// repeat="exp" 
// repeat-item="name"
// define-{name}="exp"
function renderAttributes(variables, attributes) {

    attributes = attributes || {};

    let transforms = getKeysByPrefix('define-', attributes).map(({key, value}) => { 
        return {key, code: parseCode(variables, value)}; 
    });
    let scopeTransform = combineTransformers(transforms);
    let varsPlusDefine = extendVariables(variables, transforms.map(x => x.key));
    let childrenTransform = (scope, render) => render(scope);

    let extendedVars = varsPlusDefine.slice();

    if (attributes.repeat) {
        let oldChildrenTransform = childrenTransform;
        let items = parseCode(varsPlusDefine, attributes.repeat);
        extendedVars = extendVariables(extendedVars, ['item', 'index']);
        let repeatItem = null;
        if (attributes['repeat-item']) {
            repeatItem = attributes['repeat-item'];
            extendedVars = extendVariables(extendedVars, [repeatItem, 'index_' + repeatItem]);
        }
        childrenTransform = (scope, render) => {
            var content = [];
            (items(scope) || []).map((item, index) => {
                let scopeDash = Object.assign({}, scope);
                scopeDash.item = item;
                scopeDash.index = index;
                if (repeatItem) {
                    scopeDash[repeatItem] = item;
                    scopeDash['index_' + repeatItem] = index;
                }
                content = content.concat(oldChildrenTransform(scopeDash, render));
            })
            return content;
        }
    }

    if (attributes.if) {
        let oldChildrenTransform = childrenTransform;
        let condition = parseCode(varsPlusDefine, attributes.if);
        childrenTransform = (scope, render) => {
            return condition(scope) ? oldChildrenTransform(scope, render) : [];
        }
    }

    return {extendedVars, scopeTransform, childrenTransform};
}

// Renders properties considering the following attributes:
// props="exp"
// prop-{name}="exp"
// All other static attributes
function renderProps(variables, attributes) {
    let transforms = getKeysByPrefix('prop-', attributes).map(({key, value}) => { 
        return {key, code: parseCode(variables, value)}; 
    });
    var spread = attributes && attributes.props && parseCode(variables, attributes.props);
    var propStyle = attributes && attributes.style && parseCode(variables, attributes.style);
    var texts = getAllTextAttributes(attributes).map(({key, value}) => {
        return {key, text: parseText(variables, value)};
    });
    return (scope) => {
        let props = {...(spread && spread(scope) || {})};
        for (let t of texts) props[t.key] = t.text(scope);
        for (let t of transforms) props[t.key] = t.code(scope);
        if (propStyle) props.style = propStyle(scope);
        return props;
    };
}



export function renderJson(React, variables, json) {
    if (json.type === 'element') {

        let tag = renderTagName(React, variables, json.name);
        let {
            extendedVars,
            scopeTransform,
            childrenTransform
        } = renderAttributes(variables, json.attributes);

        let props = renderProps(extendedVars, json.attributes);
        let children = renderChildren(React, extendedVars, json.children);

        return (scope) => {
            var sdash = scopeTransform(scope);
            var cdash = childrenTransform(sdash, children);
            return React.createElement(tag(scope), props(sdash), ...cdash);
        };
    } else if (json.type === 'text') {
        return parseText(variables, json.value);
    }
}