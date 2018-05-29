import {toJSON} from './normalize';

describe('toJSON', () => {
	it('Should convert a simple xml to json', () => {
		let json = toJSON(`<div if="test > 2">Test</div>`);

		expect(json).toEqual({
			type: 'element',
			name: 'div',
			children: [{ type: 'text', value: 'Test' }],
			attributes: { if: 'test > 2' }
		});
	});

	it('Should preserve order nodes', () => {
		let json = toJSON(`<div>
			Before
			<div></div>
			After
		</div>`);

		expect(json).toEqual({
			type: 'element',
			name: 'div',
			children: [
				{type: 'text', value: 'Before'},
				{type: 'element', name: 'div'},
				{type: 'text', value: 'After'}
			]
		});
	});
});