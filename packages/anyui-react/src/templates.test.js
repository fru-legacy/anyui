import {toJSON} from './normalize';
import {renderJson} from './templates';
import React from 'react';

import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('render', () => {
	it('Should respect the if attribute', () => {
        var dom = renderJson(React, toJSON(`<div if="test > 2">Test</div>`));
        expect(shallow(dom({test: 1})).text()).toBe('');
        expect(shallow(dom({test: 3})).text()).toBe('Test');
    });

    it('Should be able to iterate array', () => {
        var dom = renderJson(React, toJSON(`<div repeat="['A','B','C']">\${index}.\${item};</div>`));
        expect(shallow(dom()).text()).toBe('1.A;2.B;3.C;');
    });

    it('Should let the repeat-item to be defined', () => {
        var dom = renderJson(React, toJSON(`<div repeat="['A','B','C']" repeat-item="i">\${index_i}.\${i};</div>`));
        expect(shallow(dom()).text()).toBe('1.A;2.B;3.C;');
    });

    it('Should allow custom elements and props spread attribute', () => {
        var Element = ({a, b}) => <div>{a}{b}</div>;
        var props = {a: 'a', b: 'b'};

        var dom = renderJson(React, toJSON(`<Element props="props"/>`));
        expect(shallow(dom({Element, props})).text()).toBe('ab');
    });

    it('Should allow constant and prop attributes (jsx a="a" vs a={a})', () => {
        var Element = ({a, b}) => <div>{a}{b}</div>;

        var dom = renderJson(React, toJSON(`<Element a="a" prop-b="'b'" />`));
        expect(shallow(dom({Element})).text()).toBe('ab');
    });

    it('Should execute define before ofter attributes', () => {
        var dom = renderJson(React, toJSON(`<div if="test2 > 2" define-test2="test">Test</div>`));
        expect(shallow(dom({test: 1})).text()).toBe('');
        expect(shallow(dom({test: 3})).text()).toBe('Test');
    });

    // TODO class, class-set, style & style-set
});