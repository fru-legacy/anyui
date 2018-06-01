import * as Babel from '@babel/standalone';
import { parseExpression, parse } from 'babylon';

function createWrapperAst(expressionAst, parameterName, variables) {
    return {
        type: 'Program',
        sourceType: 'script',
        body: [
            
            // parameter1 = parameter1 || {};
            { 
                type: 'ExpressionStatement',
                expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {type: 'Identifier', name: parameterName},
                    right: {
                        type: 'LogicalExpression',
                        operator: '||',
                        left: {type: 'Identifier', name: parameterName},
                        right: {type: 'ObjectExpression', properties: []}
                    }
                }
            },

            // var a = parameter1.a; 
            ...variables.map(v => {return {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {type: 'Identifier', name: v},
                    init: {
                        type: 'MemberExpression',
                        object: {type: 'Identifier', name: parameterName},
                        property: {type: 'Identifier', name: v}
                    }
                }]
            }}),
            
            // return expression;
            {
                type: 'ReturnStatement',
                argument: expressionAst
            }
        ]
    }
}

export function parseText(variables, code) {
    if (!/\$\{/.test(code)) return () => code;
    return parseCode(variables, '`' + code + '`');
}

const PARAMETER_NAME = '__privanyuip0';

export function parseCode(variables, code) {
    let x = parseExpression(code);
    let ast = createWrapperAst(x, PARAMETER_NAME, variables);
    let transpiled = Babel.transformFromAst(ast, code, { 
        presets: ['react', 'es2015'],
        compact: true
    }).code;
    return new Function(PARAMETER_NAME, transpiled); 
}