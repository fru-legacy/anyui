import {toJSON} from './normalize';

describe('parseText', () => {
	it('Should just return normal text', () => {
    let json = toJSON(`<div if="test > 2">Test</div>`);

		expect(json).toEqual({
        type: 'element',
        name: 'div',
        children: [{ type: 'text', value: 'Test' }],
        attributes: { if: 'test > 2' }
    });
  });
});