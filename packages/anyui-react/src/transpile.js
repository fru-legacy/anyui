import * as Babel from '@babel/standalone';

const UNIQUE = 'privanyui';
const PARAMTER_NAME = `${UNIQUE}params0`;
const RETURN_PLACEHOLDER = `var ${UNIQUE}returnplaceholder;`;
const FALLBACK_FUNCTION_NAME = `${UNIQUE}func`;

function toFunction(body) {
    return new Function(PARAMTER_NAME, body); 
};

function addVariables(variables, transpiled) {
    let ensureFirstParameter = `${PARAMTER_NAME} = ${PARAMTER_NAME} || {};`;
    variables = variables.map(v => `let ${v} = ${PARAMTER_NAME}.${v};`);

    return [ensureFirstParameter].concat(variables).concat([transpiled]).join('\n');
}

function handleSpecialUnnamedFunctionCase(e, code) {
    if (e.message.indexOf('Unexpected token') != -1) {
        // Might be special case that an unnamed function is used as a statement
        
        var lines = code.split(/\r?\n/);

        var beforeLoc = lines.slice(0, e.loc.line - 1);
        var beforeLocLine = lines[e.loc.line - 1].substring(0, e.loc.column + 1);

        var afterLoc = lines.slice(e.loc.line);
        var afterLocLine = lines[e.loc.line - 1].substring(e.loc.column + 1);

        var before = beforeLoc.join('\n') + '\n' + beforeLocLine;
        var after = afterLocLine + '\n' + afterLoc.join('\n');

        if (/function\s+\($/.test(before)) {
            before = before.replace(/function\s+\($/, `function ${FALLBACK_FUNCTION_NAME} (`);
            try { 
                return transpile(before + after);
            } catch (_) {
                // empty
            }
        }
    }
}

function transpile(code) {
    return Babel.transform(code, { 
        presets: ['react', 'es2015'],
        plugins: [pluginReturnPlaceholder],
        compact: true
    }).code;
}

function transpileExpressionAsStatement(code) {
    var transpiled;
    try {
        transpiled = transpile(code);
    } catch(e) {
        transpiled = handleSpecialUnnamedFunctionCase(e, code);
        if (!transpiled) throw e;
    }

    return transpiled.replace(new RegExp(RETURN_PLACEHOLDER + '\\s*'), '\nreturn ');
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

                        if (last.type === 'ClassDeclaration') {
                            last = {
                                type: 'ExpressionStatement',
                                expression: {
                                    type: 'Identifier',
                                    name: (last.id && last.id.name) || 'window'
                                }
                            };
                            path.node.body.push(last);
                        }

                        if (VALID_LAST_STATEMENT.indexOf(last.type) !== -1) {
                            var placeholderNode = babel.parse(RETURN_PLACEHOLDER).program.body[0];
                            path.node.body.splice(path.node.body.length - 1, 0, placeholderNode);
                        }
                    }
                },
            },
        },
    };
}

export function parseText(variables, code) {
    if (!/\{|\}/.test(code)) return () => code;
    let transpiled = transpileExpressionAsStatement(addVariables(variables, '`' + code + '`'));
    return toFunction(transpiled);
}

export function parseCode(variables, code) {
    let transpiled = transpileExpressionAsStatement(addVariables(variables, code));
    return toFunction(transpiled);
}