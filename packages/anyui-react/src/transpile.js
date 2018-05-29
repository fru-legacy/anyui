import * as Babel from '@babel/standalone';

const PARAMTER_NAME = (i) => `__priv_anyui_params_${i}__`;

function toFunction(variables, body) {
    return new Function(PARAMTER_NAME(0), PARAMTER_NAME(1), body); 
};

function addVariables(variables, transpiled) {
    let ensureFirstParameter = `${PARAMTER_NAME(0)} = ${PARAMTER_NAME(0)} || {};`;
    variables = variables.map(v => `let ${v} = ${PARAMTER_NAME(0)}.${v};`);

    return [ensureFirstParameter].concat(variables).concat([transpiled]).join('\n');
}

function transpile(code) {
    return Babel.transform(code, { presets: ['react', 'es2015'] }).code;
}

function toTextFunction(variables, code) {
    let transpiled = transpile(addVariables(variables, `
        var $React = window.React, React = ${PARAMTER_NAME(1)};
        <div>${code}</div>;
    `));

    // Hack to add return; TODO use plugin
    transpiled = transpiled.replace(new RegExp(PARAMTER_NAME(1) + ';\\s*'), PARAMTER_NAME(1) + '; \nreturn ');

    return toFunction(variables, transpiled);
}

let RemoveDOMReactWrapper = { 
    createElement: function() {
        var results = [];
        var args = Array.prototype.slice.call(arguments);
        for(var i = 2; i < args.length; i++) {
            if (args[i] || args[i] === 0) results.push('' + args[i]);
        }
        return results.join('');
    }
};

export function parseText(variables, code) {
    if (!/\{|\}/.test(code)) return () => code;

    var func = toTextFunction(variables, code);
    return function(params) {
        return func(params, RemoveDOMReactWrapper);
    };
}

export function parseCode(variables, code) {
    // TODO implement
    return () => 2;
}