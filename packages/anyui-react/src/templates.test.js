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

    it('Should be able to iterate array', () => {
        var dom = renderJson(React, [], toJSON(`<div repeat="['a','b','c']">\${index}.\${item};</div>`));
        expect(shallow(dom()).text()).toBe('0.a;1.b;2.c;');
    });

    it('Should let the repeat-item to be defined', () => {
        var dom = renderJson(React, [], toJSON(`<div repeat="['a','b','c']" repeat-item="i">\${index_i}.\${i};</div>`));
        expect(shallow(dom()).text()).toBe('0.a;1.b;2.c;');
    });

    it('Should be able to repeat neseted dom', () => {
        var dom = renderJson(React, [], toJSON(`<div repeat="['a','b','c']"><span>\${item}</span></div>`));
        expect(shallow(dom()).text()).toBe('abc');
    });

    it('Should allow custom elements and props spread attribute', () => {
        var Element = ({a, b}) => <div>{a}{b}</div>;
        var props = {a: 'a', b: 'b'};

        var dom = renderJson(React, ['Element', 'props'], toJSON(`<Element props="props"/>`));
        expect(shallow(dom({Element, props})).text()).toBe('ab');
    });

    it('Should allow constant and prop attributes (jsx a="a" vs a={a})', () => {
        var Element = ({a, b, c}) => <div>{a}{b}{c}</div>;

        var dom = renderJson(React, ['Element'], toJSON(`<Element a="a" prop-b="'b'" c="\${'c'}" />`));
        expect(shallow(dom({Element})).text()).toBe('abc');
    });

    it('Should execute define before other attributes', () => {
        var dom = renderJson(React, ['test'], toJSON(`<div if="test2 > 2" define-test2="test">Test</div>`));
        expect(shallow(dom({test: 1})).text()).toBe('');
        expect(shallow(dom({test: 3})).text()).toBe('Test');
    });

    it('Should support virtual fragments', () => {
        var dom = renderJson(React, [], toJSON(`<div><virtual><span a="a"/><span b="b"/></virtual></div>`));
        expect(mount(dom()).html()).toBe(`<div><span a="a"></span><span b="b"></span></div>`);
    });

    it('Should support class property', () => {
        var dom = renderJson(React, [], toJSON(`<div class="{a: 1, b: 0}" />`));
        expect(mount(dom()).html()).toBe(`<div class="a"></div>`);
    });

    it('Should support className property', () => {
        var dom = renderJson(React, [], toJSON(`<div className="a \${'b'}" />`));
        expect(mount(dom()).html()).toBe(`<div class="a b"></div>`);
    });

    it('Should support style property', () => {
        var dom = renderJson(React, [], toJSON(`<div style="{border: '1px solid black'}" />`));
        expect(mount(dom()).get(0).props.style.border).toBe('1px solid black');
    });
});