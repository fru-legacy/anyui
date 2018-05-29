import * as Babel from '@babel/standalone';

const UNIQUE = 'privanyui';
const PARAMTER_NAME = (i) => `${UNIQUE}params${i}`;
const RETURN_PLACEHOLDER = `var ${UNIQUE}returnplaceholder;`;

function toFunction(body) {
    return new Function(PARAMTER_NAME(0), PARAMTER_NAME(1), body); 
};

function addVariables(variables, transpiled) {
    let ensureFirstParameter = `${PARAMTER_NAME(0)} = ${PARAMTER_NAME(0)} || {};`;
    variables = variables.map(v => `let ${v} = ${PARAMTER_NAME(0)}.${v};`);

    return [ensureFirstParameter].concat(variables).concat([transpiled]).join('\n');
}

function transpile(code) {
    var transiled = Babel.transform(code, { 
        presets: ['react', 'es2015'],
        plugins: [pluginReturnPlaceholder]
    }).code;

    return transiled.replace(new RegExp(RETURN_PLACEHOLDER + '\\s*'), '\nreturn ');
}

const VALID_LAST_STATEMENT = [
    'ExpressionStatement', 'FunctionDeclaration', 'ClassDeclaration'
]

function pluginReturnPlaceholder(babel) {

    return {
        visitor: {
            Program: {
                enter: function(path) {
                    if (path.node.body && path.node.body.length > 0) {
                        var last = path.node.body[path.node.body.length - 1];

                        if (VALID_LAST_STATEMENT.indexOf(last.type) !== -1) {
                            var placeholderNode = babel.parse(RETURN_PLACEHOLDER).program.body[0]
                            path.node.body.splice(path.node.body.length - 1, 0, placeholderNode);
                        } else {
                            throw last.type; // TODO remove
                        }
                    }
                },
            },
        },
    };
}


function toTextFunction(variables, code) {
    let transpiled = transpile(addVariables(variables, '`' + code + '`'));

    return toFunction(transpiled);
}

/*let RemoveDOMReactWrapper = { 
    createElement: function() {
        var results = [];
        var args = Array.prototype.slice.call(arguments);
        for(var i = 2; i < args.length; i++) {
            if (args[i] || args[i] === 0) results.push('' + args[i]);
        }
        return results.join('');
    }
};*/

export function parseText(variables, code) {
    if (!/\{|\}/.test(code)) return () => code;

    return toTextFunction(variables, code);
    /*return function(params) {
        return func(params, RemoveDOMReactWrapper);
    };*/
}

export function parseCode(variables, code) {
    let transpiled = transpile(addVariables(variables, code));
    return toFunction(transpiled);
}