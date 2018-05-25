import {transpile} from './transpile';

test('adds 1 + 2 to equal 3', () => {
	console.log(transpile('const getMessage = () => "Hello World";'));
	expect(3).toBe(3);
});
