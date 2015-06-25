// Jasmine unit tests
// To run tests, run these commands from the project root:
// 1. `npm install -g jasmine-node`
// 2. `jasmine-node spec`

/*global describe, it, expect */

'use strict';
var postcss = require('postcss');
var pxtorem = require('..');
var css = '.rule { font-size: 15px }';

describe('pxtorem', function () {

    it('should replace the px unit with rem', function () {
        var processed = postcss(pxtorem()).process(css).css;
        var expected = '.rule { font-size: 0.9375rem }';

        expect(processed).toBe(expected);
    });

    it('should replace using a root value of 10', function () {
        var expected = '.rule { font-size: 1.5rem }';
        var options = {
            root_value: 10
        };
        var processed = postcss(pxtorem(options)).process(css).css;

        expect(processed).toBe(expected);
    });

    it('should replace using a decimal of 2 places', function () {
        var expected = '.rule { font-size: 0.94rem }';
        var options = {
            unit_precision: 2
        };
        var processed = postcss(pxtorem(options)).process(css).css;

        expect(processed).toBe(expected);
    });

    it('should only replace properties in the white list', function () {
        var expected = '.rule { font-size: 15px }';
        var options = {
            prop_white_list: ['font']
        };
        var processed = postcss(pxtorem(options)).process(css).css;

        expect(processed).toBe(expected);
    });

    it('should replace all properties when white list is empty', function () {
        var rules = '.rule { margin: 16px; font-size: 15px }';
        var expected = '.rule { margin: 1rem; font-size: 0.9375rem }';
        var options = {
            prop_white_list: []
        };
        var processed = postcss(pxtorem(options)).process(rules).css;

        expect(processed).toBe(expected);
    });

    it('should ignore selectors in the selector black list', function () {
        var rules = '.rule { font-size: 15px } .rule2 { font-size: 15px }';
        var expected = '.rule { font-size: 0.9375rem } .rule2 { font-size: 15px }';
        var options = {
            selector_black_list: ['.rule2']
        };
        var processed = postcss(pxtorem(options)).process(rules).css;

        expect(processed).toBe(expected);
    });

    it('should leave fallback pixel unit with root em value', function () {
        var options = {
            replace: false
        };
        var processed = postcss(pxtorem(options)).process(css).css;
        var expected = '.rule { font-size: 15px; font-size: 0.9375rem }';

        expect(processed).toBe(expected);
    });

    it('should replace px in media queries', function () {
        var options = {
            media_query: true
        };
        var processed = postcss(pxtorem(options)).process('@media (min-width: 500px) { .rule { font-size: 16px } }').css;
        var expected = '@media (min-width: 31.25rem) { .rule { font-size: 1rem } }';

        expect(processed).toBe(expected);
    });

    it('should ignore non px properties', function () {
        var expected = '.rule { font-size: 2em }';
        var processed = postcss(pxtorem()).process(expected).css;

        expect(processed).toBe(expected);
    });

    it('should handle < 1 values and values without a leading 0', function () {
        var rules = '.rule { margin: 0.5rem .5px -0.2px -.2em }';
        var expected = '.rule { margin: 0.5rem 0.03125rem -0.0125rem -.2em }';
        var options = {
            prop_white_list: ['margin']
        };
        var processed = postcss(pxtorem(options)).process(rules).css;

        expect(processed).toBe(expected);
    });

    it('should not add properties that already exist', function () {
        var expected = '.rule { font-size: 16px; font-size: 1rem; }';
        var processed = postcss(pxtorem()).process(expected).css;

        expect(processed).toBe(expected);
    });
});
