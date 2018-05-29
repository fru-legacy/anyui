import {parseText} from './transpile';

describe('parseText', () => {
	it('Should just return normal text', () => {
		let parsed = parseText(['test'], 'abc')
		expect(parsed()).toBe('abc');
	});

	it('Should replace simple expression', () => {
		let parsed = parseText(['test'], 'a{test}c')
		expect(parsed({test: 'b'})).toBe('abc');
	});

	
});