import {parseText, parseCode} from './transpile';

describe('parseText', () => {
	it('Should just return normal text', () => {
		let parsed = parseText(['test'], 'abc')
		expect(parsed()).toBe('abc');
	});

	it('Should replace simple expression', () => {
		let parsed = parseText(['test'], 'a{test}c')
		expect(parsed({test: 'b'})).toBe('abc');
	});

	it('Should allow es5 and above', () => {
		let parsed = parseText(['test'], 'a{test**2}c');
		expect(parsed({test: 2})).toBe('a4c');
	});

	it('Should allow multiple expressions', () => {
		let parsed = parseText(['test1', 'test2'], 'a{test1}b{test2}c');
		expect(parsed({test1: 1, test2: '-'})).toBe('a1b-c');
	});

	test.skip('Should respect unescaped html entities', () => {
		let parsed = parseText(['test'], 'a{test}c<>&\'"');
		expect(parsed({test: 'b'})).toBe('abc<>&\'"');
	});

	it('Should remove tags in text', () => {
		let parsed = parseText(['test'], 'a<div>{test}</div>c');
		expect(parsed({test: 'test'})).toBe('atestc');
	});

	it('Should remove tags in expressions', () => {
		let parsed = parseText(['test'], 'a{<div>{test}</div>}c');
		expect(parsed({test: 'test'})).toBe('atestc');
	});
});

describe('parseCode', () => {
	it('Should execute simple expression', () => {
		let parsed = parseCode(['test'], 'test + 1');
		expect(parsed({test: 1})).toBe(2);
	});
});