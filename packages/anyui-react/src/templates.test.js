import {toJSON} from './normalize';
import {renderJson} from './templates';
import React from 'react';
import renderer from 'react-test-renderer';

import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('render', () => {
	it('Should respect the if attribute', () => {
        var dom = renderJson(React, toJSON(`<div if="test > 2">Test</div>`));
        expect(renderer.create(dom({test: 1})).toJSON()).toMatchSnapshot();
        expect(renderer.create(dom({test: 3})).toJSON()).toMatchSnapshot();
        expect(shallow(dom({test: 3})).text()).toBe('Test');
    });
}); 