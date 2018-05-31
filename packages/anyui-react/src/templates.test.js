import {toJSON} from './normalize';
import {renderJson} from './templates';
import React from 'react';

import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('render', () => {
	it('Should respect the if attribute', () => {
        var dom = renderJson(React, toJSON(`<div if="test > 2">Test</div>`));
        expect(shallow(dom({test: 3})).text()).toBe('Test');
    });
}); 