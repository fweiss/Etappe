"use strict";

describe('xb emits', function() {
    var xb;
    beforeEach(function() {
        xb = new XB();
    });
    it('single tag', function() {
        xb.wrap('simple');
        expect(xb.build()).toBe('<simple></simple>');
    });
    it('nested tags', function() {
        xb.wrap('a').wrap('b');
        expect(xb.build()).toBe('<a><b></b></a>');
    });
    it('an attribute', function() {
        xb.wrap('tag', { attr1: 'value1' });
        expect(xb.build()).toBe('<tag attr1="value1"></tag>');
    });
    it('two attributes', function() {
        xb.wrap('tag', { attr1: 'value1', attr2: 'value2' });
        expect(xb.build()).toBe('<tag attr1="value1" attr2="value2"></tag>');
    });
    it('two children', function() {
        var one = xb.wrap('a');
        one.wrap('b');
        one.wrap('b');
        expect(xb.build()).toBe('<a><b></b><b></b></a>');
    });

});