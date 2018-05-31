import {toJSON} from './normalize';
import {renderJson} from './templates';
import React from 'react';

import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('render', () => {
	it('Should respect the if attribute', () => {
        var dom = renderJson(React, ['test'], toJSON(`<div if="test > 2">Test</div>`));
        expect(shallow(dom({test: 1})).text()).toBe('');
        expect(shallow(dom({test: 3})).text()).toBe('Test');
    });

    test.skip('Should be able to iterate array', () => {
        var dom = renderJson(React, [], toJSON(`<div repeat="['a','b','c']">\${index}.\${item};</div>`));
        expect(shallow(dom()).text()).toBe('1.a;2.b;3.c;');
    });

    test.skip('Should let the repeat-item to be defined', () => {
        var dom = renderJson(React, [], toJSON(`<div repeat="['a','b','c']" repeat-item="i">\${index_i}.\${i};</div>`));
        expect(shallow(dom()).text()).toBe('1.a;2.b;3.c;');
    });

    test.skip('Should be able to repeat neseted dom', () => {
        var dom = renderJson(React, [], toJSON(`<div repeat="['a','b','c']"><span>\${item}</span></div>`));
        expect(shallow(dom()).text()).toBe('abc');
    });

    test.skip('Should allow custom elements and props spread attribute', () => {
        var Element = ({a, b}) => <div>{a}{b}</div>;
        var props = {a: 'a', b: 'b'};

        var dom = renderJson(React, ['Element', 'props'], toJSON(`<Element props="props"/>`));
        expect(shallow(dom({Element, props})).text()).toBe('ab');
    });

    test.skip('Should allow constant and prop attributes (jsx a="a" vs a={a})', () => {
        var Element = ({a, b}) => <div>{a}{b}</div>;

        var dom = renderJson(React, ['Element'], toJSON(`<Element a="a" prop-b="'b'" />`));
        expect(shallow(dom({Element})).text()).toBe('ab');
    });

    test.skip('Should execute define before ofter attributes', () => {
        var dom = renderJson(React, ['test'], toJSON(`<div if="test2 > 2" define-test2="test">Test</div>`));
        expect(shallow(dom({test: 1})).text()).toBe('');
        expect(shallow(dom({test: 3})).text()).toBe('Test');
    });

    // TODO class, class-set, style & style-set
});