import {toJSON} from './normalize';
import {render} from './templates';
import React from 'react';
import renderer from 'react-test-renderer';

describe('render', () => {
	it('Should respect the if attribute', () => {
        var dom = render(React, toJSON(`<div if="test > 2">Test</div>`));
        
        expect(renderer.create(dom({test: 1})).toJSON()).toMatchSnapshot();
        expect(renderer.create(dom({test: 3})).toJSON()).toMatchSnapshot();
    });
});