// Jasmine unit tests
// To run tests, run these commands from the project root:
// 1. `npm install -g jasmine-node`
// 2. `jasmine-node spec`

/*global describe, it, expect */

'use strict';
var pxtorem = require('../lib/pxtorem');
var css = '.rule { font-size: 15px }';

describe('pxtorem', function () {

    it('should replace the px unit with rem', function () {
        var processed = pxtorem(css);
        var expected = '.rule { font-size: 0.9375rem }';

        expect(processed).toBe(expected);
    });

    it('should replace using a root value of 10', function () {
        var expected = '.rule { font-size: 1.5rem }';
        var processed = pxtorem(css, {
            root_value: 10
        });

        expect(processed).toBe(expected);
    });

    it('should replace using a decimal of 2 places', function () {
        var expected = '.rule { font-size: 0.94rem }';
        var processed = pxtorem(css, {
            unit_precision: 2
        });

        expect(processed).toBe(expected);
    });

    it('should only replace properties in the white list', function () {
        var expected = '.rule { font-size: 15px }';
        var processed = pxtorem(css, {
            prop_white_list: ['font']
        });

        expect(processed).toBe(expected);
    });

    it('should leave fallback pixel unit with root em value', function () {
        var processed = pxtorem(css, {
            replace: false
        });
        var expected = '.rule { font-size: 15px; font-size: 0.9375rem }';

        expect(processed).toBe(expected);
    });

    it('should replace px in media queries', function () {
        var processed = pxtorem('@media (min-width: 500px) { .rule { font-size: 16px } }', {
            media_query: true
        });
        var expected = '@media (min-width: 31.25rem) { .rule { font-size: 1rem } }';

        expect(processed).toBe(expected);
    });

    it('should ignore non px properties', function () {
        var expected = '.rule { font-size: 2em }';
        var processed = pxtorem(expected);

        expect(processed).toBe(expected);
    });

    it('should handle < 1 values and values without a leading 0', function () {
        var css = '.rule { margin: 0.5rem .5px -0.2px -.2em }';
        var expected = '.rule { margin: 0.5rem 0.03125rem -0.0125rem -.2em }';
        var processed = pxtorem(css, {
            prop_white_list: ['margin']
        });

        expect(processed).toBe(expected);
    });

    it('should not add properties that already exist', function () {
        var expected = '.rule { font-size: 16px; font-size: 1rem; }';
        var processed = pxtorem(expected);

        expect(processed).toBe(expected);
    });
});
