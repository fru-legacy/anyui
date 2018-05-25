import * as Babel from '@babel/standalone';

export function transpile(code) {
    return Babel.transform(code, { presets: ['es2015'] }).code;
}